import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Michael O.",
      comment: "Amazing tips! Won 8 out of 10 bets this week 💰",
      rating: 5
    },
    {
      name: "Sarah K.",
      comment: "VIP tips are worth every naira. Great accuracy!",
      rating: 5
    },
    {
      name: "Ahmed B.",
      comment: "Been following for 2 months, very consistent wins ⚽",
      rating: 5
    }
  ];

  return (
    <div className="testimonials-section">
      <h3>💬 What Our Users Say</h3>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="stars">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <p>"{testimonial.comment}"</p>
            <div className="testimonial-author">- {testimonial.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
