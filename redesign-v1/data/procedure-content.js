/* ------------------------------------------------------------------
   PROCEDURE PAGE CONTENT: the words that fill the standard format.

   Every procedure page has the same sections, in the same order:
     1 Hero  2 Overview + At a glance + Is it right for you?
     3 What to expect (process)  4 Results (from the Library)
     5 Questions  6 Related  7 Request a consultation

   `defaults` fill every page, so adding a procedure takes only its name,
   category, blurb and detail (in procedures.js). `overrides` give a
   procedure its own wording where the practice has it. Admin will edit
   both. DRAFT: all text needs Dr. Newman's review before launch.
------------------------------------------------------------------- */
window.NPS = window.NPS || {};

NPS.procDefaults = {
  surgical: {
    glance: [['Type', 'Surgical'], ['It begins with', 'A private consultation with Dr. Newman'], ['Recovery', 'Personal to you. Your plan is made at your consultation'], ['Results', 'Individual. See real results below']],
    good: ['You are physically healthy and realistic about what surgery can do', 'You are looking for improvement, not perfection', 'You do not smoke, or are willing to stop before and after surgery', 'You want a result that still looks like you'],
    discuss: ['Your goals, in your own words', 'Your medical history and any medications', 'Your options, including non-surgical alternatives', 'Risks, recovery and what to plan for at home and at work', 'Cost, insurance questions and financing'],
    steps: [['Consult', 'A private, unhurried conversation about your goals, your health and your options.'], ['Plan', 'A personal plan from Dr. Newman, with transparent pricing and financing options.'], ['Procedure', 'Performed with precision in a comfortable, discreet setting.'], ['Recover', 'Close follow-up and direct access to our team until you are fully healed.']],
    recovery: 'Recovery is personal. It depends on the procedure and on your health. At your consultation you will get a clear timeline, with a plan for rest, help at home and follow-up care.'
  },
  'non-surgical': {
    glance: [['Type', 'Non-surgical'], ['It begins with', 'A conversation about your goals'], ['Downtime', 'Little to none for many treatments, confirmed at your visit'], ['Results', 'Individual. See real results below']],
    good: ['You want a refresh with little or no downtime', 'You are in good general health', 'You would like a natural-looking result', 'You are open to a series of treatments if one is recommended'],
    discuss: ['Your goals and what is realistic', 'Your skin, medical history and medications', 'Which product or device suits you best', 'What to expect during and after treatment', 'Cost, and how often treatments are recommended'],
    steps: [['Consult', 'Share your goals and concerns. We explain your options clearly.'], ['Plan', 'A tailored recommendation, including products, timing and cost.'], ['Treatment', 'Comfortable, precise and usually quick.'], ['Aftercare', 'Simple guidance, and follow-up to check your progress.']],
    recovery: 'Many non-surgical treatments need little or no downtime, but it varies by treatment and by person. We will explain exactly what to expect and how to care for your skin afterward.'
  }
};

/* Questions shared by every procedure page. {t} becomes the procedure name. */
NPS.procFaq = [
  ['What happens at a consultation?', 'Your consultation is a conversation about your goals, medical history and the options available to you. It is the time to ask about suitability, risks, recovery, anticipated outcomes and costs.'],
  ['How do I know if {t} is right for me?', 'Start with your goals. Dr. Newman and the team can help you explore surgical and non-surgical options and discuss which, if any, may be appropriate for you.'],
  ['What about recovery?', '{recovery}'],
  ['What are the risks?', 'Every procedure carries some uncertainty and risk. Dr. Newman will review the risks that apply to you in detail before you decide, and you can reduce them by following your care team’s advice closely.'],
  ['Can I see before-and-after photos?', 'Yes. Photos of this procedure appear in Results on this page when patients have given permission. Other photographs are shown only in the office, to protect patient privacy.'],
  ['How do I pay?', 'Contact the practice to discuss current payment and financing arrangements. We accept all major credit cards and CareCredit (restrictions apply).']
];

NPS.procOverrides = {
  'facelift': {
    overview: ['As people age, gravity, sun exposure and the stresses of daily life show in the face: deeper creases between the nose and mouth, a softer jawline, and folds around the neck.',
               'A facelift (rhytidectomy) can’t stop the aging process. What it can do is set back the clock, improving the most visible signs of aging by removing excess fat, tightening underlying muscles and redraping the skin of the face and neck.'],
    good: ['Your face and neck have begun to sag, but your skin still has some elasticity', 'Your bone structure is strong and well defined', 'You are physically healthy and realistic about the result', 'You want to look rested and like yourself, not like someone else']
  },
  'breast-augmentation': {
    overview: ['Breast augmentation (augmentation mammoplasty) enhances the size and shape of the breast. Women choose it for many personal reasons: to feel better proportioned, to restore volume lost after pregnancy or weight loss, to improve symmetry, or as part of a lift or reconstruction.',
               'By placing an implant behind each breast, a surgeon can increase the bust line by one or more bra cup sizes. Implant type, size and shape are chosen around your anatomy, your body type and the look you want.'],
    glance: [['Type', 'Surgical'], ['Implants', 'Silicone or saline, chosen with you'], ['Recovery', 'Personal to you. Your plan is made at your consultation'], ['Results', 'Individual. See real results below']],
    good: ['You are looking for improvement, not perfection', 'You are physically healthy and realistic about the outcome', 'You want proportions that suit your body', 'Your breasts have finished developing']
  },
  'tummy-tuck': {
    overview: ['Abdominoplasty, known as a tummy tuck, is a major surgical procedure that removes excess skin and fat from the middle and lower abdomen and can tighten the abdominal muscles.',
               'It is often chosen by people who are in relatively good shape but bothered by loose skin or a fat deposit that doesn’t respond to diet and exercise, including after pregnancy or major weight loss.'],
    good: ['You are in relatively good shape but bothered by loose abdominal skin or a stubborn fat deposit', 'Your weight is stable (if you plan to lose a lot, it is usually best to wait)', 'You are done having children, or are comfortable waiting', 'You are physically healthy and realistic about the result']
  },
  'nose-surgery': {
    overview: ['Nose surgery (rhinoplasty) reshapes the nose to bring it into better balance with your other features. Small changes can make a meaningful difference to the whole face.',
               'Because the nose sits at the center of the face, planning is precise and personal. Your consultation explores what you would like to change, what your anatomy allows, and what is realistic.']
  },
  'botox': {
    overview: ['Botox temporarily softens the expression lines that form with repeated movement, such as frown lines, forehead lines and crow’s feet.',
               'Treatments are quick and are placed with care, so you still look like you. Results build over several days and typically last a few months, and many people schedule regular visits.'],
    glance: [['Type', 'Non-surgical'], ['Treatment', 'Usually a short visit'], ['Downtime', 'Little to none'], ['Results', 'Gradual, typically lasting a few months']]
  },
  'halo-laser': {
    overview: ['Over time, sun exposure and aging can leave skin with sun spots, fine lines and a lost glow. Halo is a hybrid fractional laser that treats tone, texture and fine lines in a single session.',
               'It is a popular first step toward a clearer, more radiant complexion, with less downtime than traditional resurfacing.']
  }
};
