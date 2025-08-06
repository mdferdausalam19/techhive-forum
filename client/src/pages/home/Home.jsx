import LatestPosts from "../../components/forum/LatestPosts";
import HeroBanner from "../../components/home/HeroBanner";
import Newsletter from "../../components/home/Newsletter";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <LatestPosts />
        <Newsletter />
      </div>
    </>
  );
}
