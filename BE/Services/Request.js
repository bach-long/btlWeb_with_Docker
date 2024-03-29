const {
    db,
    Product,
    MODEL,
    Version,
    Color,
    Status,
    Manager,
    Request,
  } = require("../models");

  var getDetail = async (id) => {
    const detail = await Request.findByPk(id, {
        include: ['factory', 'store', 
          {
            model: MODEL,
            as: "model",
            attributes: ["id", "name", "deletedAt"],
            paranoid: false
          },
          {
            model: Version,
            as: "version",
            attributes: ["id", "name", "price", "deletedAt"],
            paranoid: false
          },
          {
            model: Color,
            as: "color",
            attributes: ["id", "name", "code"],
          },
        ],
    })
    return detail;
  }

  var makeRequests = async (requests) => {
    try {
      const newRequests = await Request.bulkCreate(requests);
      if(!newRequests) {
        throw "error in creating new request";
      } else {
        return newRequests;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  var accept = async (id, factory_id) => {
    try {
      console.log(id);
      const request = await Request.findByPk(id);
      //console.log(request);

      let products = await Manager.findByPk(factory_id, {
        include: [
          {
            required: false,
            model: Product,
            as: 'products',
            through: {
              attributes: [],
            },
            where: {
              version_id: request.version_id,
              color_id: request.color_id,
              status_id: 1,
            },
          }
        ]
      });

      products = products.get({ plain: true }).products;
      if(products.length < request.amount) {
        return {err: "not enough to supply"}
      }
      else {
        products = products.slice(0,request.amount).map(element => {return element.id})
        request.progress = 1;
        request.acceptedAt = new Date();
        await request.save();
        const result = await Product.update({request_id: request.id, status_id: 3}, {where: {
          id: products
        }, 
        returning: true,
        plain: true,});
        if(result) {
          return products;
        } else {
          throw "error in update product status to 3"
        }
      } 
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  var destroy = async (id) => {
    try {
      const request = await Request.findByPk(id);
      await request.destroy();
      return true
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  var refuse = async (id, reason) => {
    try {
      const request = await Request.findByPk(id);
      if(request) {
        request.progress = -1;
        request.canceledAt = new Date();
        request.canceledReason = reason,
        await request.save();
        return true
      } else {
        throw "request not found";
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  var complete = async (id) => {
    try {
      const request = await Request.findByPk(id,{
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id']
          }
        ]
      });
      request.progress = 2;
      request.completedAt = new Date();
      await request.save();

      const products = await Product.update({status_id: 4}, {where: {request_id: request.id, status_id: 3}});

      const updatedProducts = request.get({ plain: true }).products.map(element => {return element.id});

      if(!products) {
        throw "can not update products";
      }
      return updatedProducts;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  module.exports = {
    getDetail,
    makeRequests,
    destroy,
    refuse,
    accept,
    complete,
  }