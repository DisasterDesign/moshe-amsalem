import HomeContact from "@/components/HomeContact";

export default function ContactPage() {
  return (
    <>
      {/* Header band */}
      <section className="pt-24 md:pt-28 pb-12 md:pb-16 bg-dark">
        <div className="container-custom text-center">
          <h1 className="heading-xl mb-4 text-white">
            צור <span className="text-gold">קשר</span>
          </h1>
          <p className="text-light-secondary text-lg max-w-2xl mx-auto">
            נשמח לשמוע ממך ולסייע בכל שאלה או פנייה - בטלפון, בוואטסאפ או במייל.
          </p>
        </div>
      </section>

      <HomeContact />
    </>
  );
}
