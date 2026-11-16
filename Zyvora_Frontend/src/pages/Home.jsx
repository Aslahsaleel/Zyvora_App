import { ArrowRight, ArrowUpRight, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const edits = [
  { title: "The tailored edit", note: "Sharp lines. Softer structure.", tag: "01", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85" },
  { title: "Everyday layers", note: "Pieces that work harder.", tag: "02", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85" },
  { title: "Quiet accessories", note: "The finishing details.", tag: "03", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85" }
];

export default function Home() {
  const { user } = useAuth();
  return (
    <main>
      <section className="fashion-hero">
        <div className="fashion-hero-copy">
          <span className="eyebrow"><i /> THE NEW WARDROBE</span>
          <h1>Dress like<br />you <em>mean it.</em></h1>
          <p>Thoughtful fashion for the days that become your story. Discover the pieces you'll reach for, again and again.</p>
          <Link className="button button-dark" to={user ? "/products" : "/login"}>Explore the collection <ArrowUpRight size={17} /></Link>
          <div className="hero-footnote"><span>01 — 26</span><span>THE ZYVORA EDITION</span></div>
        </div>
        <div className="fashion-hero-image">
          <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=90" alt="Editorial fashion look in neutral tones" />
          <div className="hero-image-caption"><span>THE ART OF DRESSING WELL</span><span>EST. MMXXVI</span></div>
          <div className="hero-image-index">A<br />W</div>
        </div>
      </section>

      <section className="marquee-strip"><span>LESS, BUT BETTER</span><b>✳</b><span>PERSONAL STYLE, CONSIDERED</span><b>✳</b><span>MADE FOR EVERYDAY</span></section>

      <section className="section-wrap edit-section">
        <div className="section-heading">
          <div><span className="eyebrow">A CONSIDERED COLLECTION</span><h2>Find your <em>point of view.</em></h2></div>
          <p>Not more. Just the right pieces — selected for the way you move through the world.</p>
        </div>
        <div className="edit-grid">
          {edits.map((edit) => <Link className="edit-card" to={user ? "/products" : "/login"} key={edit.tag}>
            <div className="edit-image"><img src={edit.image} alt={edit.title} /><span>{edit.tag}</span><ArrowUpRight size={20} /></div>
            <div className="edit-card-copy"><div><h3>{edit.title}</h3><p>{edit.note}</p></div><MoveRight size={20} /></div>
          </Link>)}
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-image"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85" alt="Contemporary fashion editorial" /></div>
        <div className="manifesto-copy"><span className="eyebrow">THE ZYVORA PHILOSOPHY</span><h2>Style is not<br />about more.<br />It's about <em>you.</em></h2><p>We believe the best wardrobe is a thoughtful one. Pieces with purpose, silhouettes with ease, and details that feel unmistakably yours.</p><Link className="text-link" to={user ? "/products" : "/login"}>Discover the collection <ArrowRight size={17} /></Link></div>
      </section>
      <section className="newsletter-band"><span>THE GOOD EDIT, IN YOUR INBOX</span><p>New arrivals, considered styling and a little inspiration.</p><Link to={user ? "/products" : "/register"}>Join the world of ZYVORA <ArrowUpRight size={17} /></Link></section>
    </main>
  );
}
