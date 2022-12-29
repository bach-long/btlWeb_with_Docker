import { useContext, useEffect, useState } from "react";
import AnalysisLineChart from "../../../../Components/Chart/Line/AnalysisLineChart";
import { AuthContext } from "../../../../Provider/AuthProvider";

export default function MonthyAnalysis({ req }) {
  const { authUser } = useContext(AuthContext);
  const [params, setParams] = useState();

  useEffect(() => {
    if (authUser && req) {
      setParams({
        managerId: authUser.id,
        type: "sold",
        option: "quarter",
        year: req.year,
      });
    }
  }, [authUser, req]);

  return (
    <AnalysisLineChart
      params={params}
      title={`Biểu đồ phân tích lượng sản phẩm tiêu thụ theo các quý năm ${req?.year}`}
      endIndex={4}
      titleX="Quý"
    />
  );
}
