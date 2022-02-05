export default function Contact() {
  return (
    <section className="contact flow-content" id="contact">
      <h2 className="contact--title">I am happy to collaborate. Contact me.</h2>
      <form action="#" className="contact--form flow-content">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div>
          <label htmlFor="from">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea type="text" name="message" id="message"></textarea>
        </div>
        <button className="contact--form--btn btn" type="submit">
          Send Message
        </button>
      </form>
    </section>
  );
}
