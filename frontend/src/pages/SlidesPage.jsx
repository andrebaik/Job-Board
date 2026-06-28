import { useNavigate } from "react-router-dom";
import SlideViewer from "../components/slides/SlideViewer";

function SlidesPage() {
  const navigate = useNavigate();
  return <SlideViewer onClose={() => navigate("/")} />;
}

export default SlidesPage;
