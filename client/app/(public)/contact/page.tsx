import type { Metadata } from 'next';
import { Clock3, MapPin, MessageCircle } from 'lucide-react';
import { InquiryForm } from '@/components/property/inquiry-form';

export const metadata: Metadata = {
  title: 'Contact EstatePro | Talk with a local advisor',
  description: 'Tell EstatePro what you are looking for and a local property advisor will be in touch.',
};

export default function ContactPage() {
  return (
    <main className="page-container py-12 md:py-16">
      <div className="contact-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-rule" /> WE ARE HERE TO HELP
          </p>
          <h1 className="page-title">
            Start a <em>conversation.</em>
          </h1>
          <p className="page-lede">
            Tell us where you are in the process. We will help you find a clear next step.
          </p>
        </div>
        <div className="contact-details">
          <div>
            <MapPin size={17} />
            <span>
              <strong>Where we work</strong>
              <small>Lagos &middot; Abuja &middot; Niger State</small>
            </span>
          </div>
          <div>
            <Clock3 size={17} />
            <span>
              <strong>When to reach us</strong>
              <small>Send a message any time.</small>
            </span>
          </div>
          <div>
            <MessageCircle size={17} />
            <span>
              <strong>What to expect</strong>
              <small>A local advisor will reply personally.</small>
            </span>
          </div>
        </div>
      </div>
      <section id="contact-form" className="contact-form-wrap">
        <div className="contact-note">
          <p className="eyebrow">
            <span className="eyebrow-rule" /> A GOOD PLACE TO BEGIN
          </p>
          <h2 className="mt-4 font-display text-2xl font-medium">What does home look like for you?</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Share what you have in mind. You can ask about a home, a neighbourhood, or how to get started.
          </p>
        </div>
        <InquiryForm />
      </section>
    </main>
  );
}
