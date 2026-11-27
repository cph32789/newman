/* ------------------------------------------------------------------
   "In the media": magazine features, and the video library.
   Managed in Admin ("Media").

   articles   a magazine page or press piece, shown as a cover that opens full size
     id, title, publication (optional), image, image2 (optional second page), w, h, link (optional)
   videos     YouTube or Vimeo links (recommended) or a video file on this site
     id, title, text, kind ('youtube' | 'vimeo' | 'file'), ref (the video id, or the file path), poster (file videos)
   Images are copies from the previous website. The publication names were not recorded there:
   add them in Admin.
------------------------------------------------------------------- */
window.NPS = window.NPS || {};
NPS.media = {
  intro: 'Features about Dr. Newman and the practice, and short videos that show what to expect.',
  articles: [
    { id: 'beyond-the-pink', title: 'Beyond the Pink: Breast Reconstruction, Transformation and Restoration', image: 'assets/img/media/beyond-the-pink.webp', image2: 'assets/img/media/beyond-the-pink-2.webp', w: 1200, h: 1599 },
    { id: 'balanced-beauty-plastic-surgery', title: 'Balanced Beauty in Plastic Surgery', image: 'assets/img/media/balanced-beauty-plastic-surgery.webp', w: 1200, h: 1580 },
    { id: 'choosing-the-best-procedure', title: 'Choosing the Best Procedure', image: 'assets/img/media/choosing-the-best-procedure.webp', w: 1200, h: 1599 },
    { id: 'invest-in-yourself', title: 'Invest in Yourself', image: 'assets/img/media/invest-in-yourself.webp', w: 1200, h: 1547 },
    { id: 'do-your-homework', title: 'Cosmetic Surgery: Do Your Homework', image: 'assets/img/media/do-your-homework.webp', w: 1200, h: 1607 },
    { id: 'balanced-beauty', title: 'Balanced Beauty', image: 'assets/img/media/balanced-beauty.webp', w: 1200, h: 1609 },
    { id: 'doctors-orders', title: 'Doctors’ Orders', image: 'assets/img/media/doctors-orders.webp', w: 1200, h: 1609 },
    { id: 'youthful-sunshine-state', title: 'Youthful in the Sunshine State', image: 'assets/img/media/youthful-sunshine-state.webp', w: 609, h: 816 }
  ],
  videos: [
    { id: 'halo', title: 'Halo™ laser treatments', text: 'Over time, your skin can lose its youthful glow from sun exposure and natural aging. Halo targets the right depth to reduce years of damage and restore the luminous glow you had when you were younger.', kind: 'file', ref: 'assets/video/halo-laser.mp4', poster: 'assets/video/halo-laser-poster.jpg' },
    { id: 'kybella', title: 'Kybella™', text: 'Dr. Newman receiving a Kybella treatment. Kybella is the first and only FDA-approved nonsurgical treatment that contours and improves the appearance of fullness under the chin.', kind: 'file', ref: 'assets/video/kybella.mp4', poster: 'assets/video/kybella-poster.jpg' },
    { id: 'microneedling', title: 'Microneedling', text: 'One of our patients receiving skin rejuvenation with microneedling and PRP, sometimes called a “vampire facial.” The goals are even tone and texture, smaller-looking pores, collagen production and more resilient skin.', kind: 'file', ref: 'assets/video/microneedling.mp4', poster: 'assets/video/microneedling-poster.jpg' },
    { id: 'miradry', title: 'miraDry®', text: 'Patients are comfortable throughout the miraDry procedure. Watch Dr. Newman receive his own treatment in this short video from October 2015.', kind: 'youtube', ref: 'KRKIadOPhrc' },
    { id: 'mothers', title: 'Balanced Beauty for Mothers', text: 'Motherhood is a beautiful gift. We offer restorative procedures, from Mommy Makeovers, breast augmentation and tummy tucks to skin care, so you can feel more like you.', kind: 'youtube', ref: 'tT7nvG7bGsQ' },
    { id: 'microblading', title: 'Microblading', text: 'Meet Kim, our Orlando microblading specialist. She explains what microblading is and what to expect from this in-office procedure, and you will see a treatment from start to finish.', kind: 'youtube', ref: 'OLbSg9XIKjI' },
    { id: 'chad-pitt', title: 'Patient testimonial: Chad Pitt', text: 'Radio personality Chad Pitt shares his experience as a patient: how comfortable the practice made him, and how the team knew how to bring out the best in his face while keeping it friendly and approachable.', kind: 'youtube', ref: 'DCSO3onBBZw' }
  ]
};
