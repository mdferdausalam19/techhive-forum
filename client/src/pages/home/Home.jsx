import LatestPosts from "../../components/home/LatestPosts";
import HeroBanner from "../../components/home/HeroBanner";
import Newsletter from "../../components/home/Newsletter";
import FAQ from "../../components/home/FAQ";
import Testimonials from "../../components/home/Testimonials";
import Announcement from "../../components/home/Announcement";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <div className="bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="py-16">
          <LatestPosts />
          <Newsletter />
          <Testimonials />
          <Announcement />
          <FAQ />
        </div>
      </div>
    </>
  );
}
