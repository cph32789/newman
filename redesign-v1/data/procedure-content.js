/* ------------------------------------------------------------------
   PROCEDURE PAGE CONTENT

   RULE: a procedure page shows only what is UNIQUE to that procedure.
   Anything that is the same for every procedure lives once on the shared
   "Your visit" page and is linked, never repeated.

   Per procedure (all optional):
     overview   1-2 paragraphs                 glance    4 quick facts
     good       "May be a good fit if" list    timeline  Recovery & timeline phases
     faq        3-4 questions about THIS procedure

   A section appears on a procedure page only when it has content here
   (Results appears only when the Library has that procedure's own cases).
   Missing sections become small "next step" cards linking to the shared pages.

   SOURCE: wording for the 15 procedures below was drafted from the
   practice's own descriptions on the current website (candidates, anesthesia,
   the surgery, recovery, results). DRAFT: Dr. Newman must review before launch.
------------------------------------------------------------------- */
window.NPS = window.NPS || {};

/* ---------- Shared content (lives on /your-visit/, linked from every procedure) ---------- */
NPS.visit = {
  journey: {
    surgical: [['Consult', 'A private, unhurried conversation with Dr. Newman about your goals, your health and your options. Nothing is decided in this visit unless you want it to be.'], ['Plan', 'A personal plan, with transparent pricing and financing options. You take the time you need.'], ['Procedure', 'Performed with precision in a comfortable, discreet setting.'], ['Recover', 'Close follow-up and direct access to our team until you are fully healed.']],
    nonsurgical: [['Consult', 'Share your goals and concerns. We explain your options clearly.'], ['Plan', 'A tailored recommendation, including products, timing and cost.'], ['Treatment', 'Comfortable, precise and usually quick.'], ['Aftercare', 'Simple guidance, and follow-up to check your progress.']]
  },
  discuss: ['Your goals, in your own words', 'Your medical history and any medications', 'Your options, including non-surgical alternatives', 'Risks, recovery and what to plan for at home and at work', 'Cost, insurance questions and financing'],
  faq: [
    ['What happens at a consultation?', 'Your consultation is a conversation about your goals, medical history and the options available to you. It is the time to ask about suitability, risks, recovery, anticipated outcomes and costs.'],
    ['What if I’m not sure which procedure I want?', 'Start with your goals. Dr. Newman and the team can help you explore surgical and non-surgical options and discuss which, if any, may be appropriate for you.'],
    ['What are the risks?', 'Every procedure carries some uncertainty and risk. Dr. Newman will review the risks that apply to you in detail before you decide, and you can reduce them by following your care team’s advice closely.'],
    ['Can I see before-and-after photographs?', 'Yes. Selected cases appear on the matching procedure page, and in our patient gallery, when patients have given permission. Other photographs are shown only in the office, to protect patient privacy.'],
    ['Is plastic surgery covered by insurance?', 'Cosmetic surgery, which reshapes normal structures to improve appearance, is usually not covered by insurance. Reconstructive surgery, which corrects abnormal structures caused by birth defects, injury, infection, tumors or disease, may be. Your policy is a contract between you and your plan, so please check with your provider. If you have an HMO plan, a referral from your primary care physician is required before your appointment.'],
    ['How do I pay?', 'We accept all major credit cards and CareCredit (restrictions apply). Please contact the office for billing questions.'],
    ['Do I need someone to help me afterward?', 'For surgery, plan to have someone drive you home and help you for a few days if needed. Your care team will explain exactly what to arrange.'],
    ['Can I bring my saved list?', 'Yes. Tap the heart on anything that interests you, and we will add your list to your consultation request.']
  ]
};

/* ---------- Procedure-specific content ---------- */
NPS.procOverrides = {

/* ============================== FACE ============================== */
'facelift': {
  overview: ['As people age, gravity, sun exposure and the stresses of daily life show in the face: deeper creases between the nose and mouth, a softer jawline, and folds around the neck.',
             'A facelift (rhytidectomy) can’t stop the aging process. What it can do is set back the clock, improving the most visible signs of aging by removing excess fat, tightening underlying muscles and redraping the skin of the face and neck.'],
  good: ['Your face and neck have begun to sag, but your skin still has some elasticity', 'Your bone structure is strong and well defined', 'You are physically healthy and realistic about the result', 'You want to look rested and like yourself, not like someone else'],
  glance: [['Type', 'Surgical'], ['Setting', 'Usually outpatient'], ['Anesthesia', 'Local with sedation, or general'], ['Surgery time', 'Several hours']],
  timeline: [
    ['Before', 'Follow your surgeon’s instructions on eating, drinking, smoking and medications. If you smoke, stop at least a week or two before and after surgery, since smoking can interfere with healing.'],
    ['Surgery day', 'Usually done as an outpatient. Most facelifts use local anesthesia with a sedative, so you are awake but relaxed; some surgeons prefer general anesthesia. It usually takes several hours.'],
    ['First days', 'There usually isn’t significant discomfort, and prescribed medication can ease it. Some numbness is normal and fades over weeks or months. You may be asked to keep your head elevated and still for a couple of days.'],
    ['First weeks', 'You should be up and about in a day or two, but take it easy for the first week and be gentle with your face and hair. Avoid strenuous activity for at least two weeks.'],
    ['Months ahead', 'Results may not be immediately apparent. Hair around the temples may be thin and skin may feel dry or rough for several months. Scars are usually hidden by hair or in the natural creases of the face and ears.']],
  faq: [
    ['Will I be awake during a facelift?', 'Most facelifts are done under local anesthesia with a sedative, so you are awake but relaxed and may feel some tugging. Some surgeons prefer general anesthesia, in which case you sleep through it. Dr. Newman will recommend the best option for you.'],
    ['How long does a facelift take?', 'It usually takes several hours, or somewhat longer if you are having more than one procedure. For extensive procedures, a surgeon may schedule two sessions.'],
    ['What about scars?', 'You will have some scars, but they are usually hidden by your hair or in the natural creases of the face and ears.'],
    ['What age is best for a facelift?', 'Most patients are in their forties to sixties, but facelifts can be done successfully in people in their seventies or eighties too.']]
},
'eyelid-surgery': {
  overview: ['Eyelid surgery (blepharoplasty) removes excess skin, muscle and underlying fat from the upper and lower lids. It can correct drooping upper lids and puffy bags beneath the eyes, features that can make you look older and more tired than you feel.',
             'The best candidates are physically healthy, psychologically stable and realistic. Most are 35 or older, but if droopy, baggy eyelids run in your family, you may decide to have surgery earlier.'],
  good: ['Drooping upper lids or puffy lower lids make you look more tired than you feel', 'You are physically healthy and realistic about the result', 'Droopy or baggy eyelids run in your family (some people choose to start earlier)', 'You have thought carefully about your expectations'],
  glance: [['Type', 'Surgical'], ['Setting', 'Usually outpatient'], ['Anesthesia', 'Local with sedation, or general'], ['Surgery time', 'One to three hours']],
  timeline: [
    ['Before', 'Follow your surgeon’s instructions. Arrange for someone to drive you home and help you for a few days.'],
    ['Surgery day', 'Usually done under local anesthesia around the eyes with oral or intravenous sedation. It takes one to three hours, depending on the extent of surgery. Upper lids are usually done first, then lower.'],
    ['First days', 'Your eyes may be lubricated with ointment and bandaged. Eyelids may feel tight and sore as the anesthesia wears off; prescribed medication can ease it. You can usually read or watch television after two or three days.'],
    ['First weeks', 'Most people feel ready to go out and return to work in a week to 10 days, with makeup to cover remaining bruising. You can’t wear contact lenses for about two weeks, and you may be sensitive to sun and wind for several weeks.'],
    ['Months ahead', 'Healing is gradual. Scars may stay slightly pink for six months or more, then fade to a thin, nearly invisible line. The more alert, youthful look typically lasts for years.']],
  faq: [
    ['Will I be awake during eyelid surgery?', 'It is usually done under local anesthesia with sedation, so you are awake but relaxed and insensitive to pain, though you may feel some tugging. Some surgeons prefer general anesthesia, in which case you sleep through it.'],
    ['How long does it take?', 'Usually one to three hours, depending on how much is being done. If all four eyelids are treated, the upper lids are usually done first.'],
    ['When can I wear contact lenses and makeup?', 'You won’t be able to wear contact lenses for about two weeks, and they may feel uncomfortable for a while after. Depending on how you heal, you can probably wear makeup to cover bruising in about a week to 10 days.'],
    ['How long do the results last?', 'The positive results last for years, and for many people they are permanent.']]
},
'nose-surgery': {
  overview: ['Nose surgery (rhinoplasty) reshapes the nose to bring it into better balance with your other features. Small changes can make a meaningful difference to the whole face.',
             'The nose’s skin is separated from its framework of bone and cartilage, which is then sculpted to the desired shape before the skin is redraped. The approach depends on your goals and your surgeon’s technique.'],
  good: ['You are looking for improvement, not perfection', 'You are physically healthy and realistic about the result', 'You have thought carefully about your expectations and discussed them openly', 'You want your nose to suit the rest of your face'],
  glance: [['Type', 'Surgical'], ['Setting', 'Usually outpatient'], ['Anesthesia', 'Local or general'], ['Surgery time', 'An hour or two']],
  timeline: [
    ['Before', 'Follow your surgeon’s instructions on eating, drinking, smoking, medications and washing your face. Arrange for someone to drive you home and help you for a few days.'],
    ['Surgery day', 'Rhinoplasty usually takes an hour or two, though complicated procedures may take longer. It may be done under local anesthesia with light sedation or under general anesthesia, depending on the extent of the work and your preference.'],
    ['First days', 'Your face will feel puffy, your nose may ache and you may have a dull headache. Stay in bed with your head elevated for the first day. Swelling and bruising around the eyes build for two or three days, and cold compresses help.'],
    ['First weeks', 'Most people are up and about within two days and can return to school or desk work in about a week, though it takes several weeks to be fully up to speed. Avoid strenuous activity for two to three weeks.'],
    ['Months ahead', 'Within a week or two you will no longer look as if you have just had surgery. Healing is slow and gradual, and some subtle swelling may remain for months.']],
  faq: [
    ['How long does rhinoplasty take?', 'Usually an hour or two, though complicated procedures may take longer.'],
    ['Will I be asleep?', 'It depends on the extent of the procedure and what you and your surgeon prefer. With local anesthesia you are lightly sedated and awake but relaxed; with general anesthesia you sleep through the operation.'],
    ['When will I look like myself again?', 'Swelling and bruising around the eyes peak after two or three days. Within a week or two you will no longer look as if you have just had surgery, though subtle swelling can remain for months.'],
    ['Is it normal to feel low afterward?', 'Yes. Many patients feel down for a while after plastic surgery. It is normal and understandable, and it passes as you heal and see the result.']]
},
'ear-surgery': {
  overview: ['Ear surgery (otoplasty) adjusts the shape or position of the ears, for adults and for children. A common technique places a small incision behind the ear to reach the cartilage, which is then shaped and bent back toward the head.',
             'Non-removable stitches may be used to help the ear keep its new shape. The technique depends on the specific concern.'],
  glance: [['Type', 'Surgical'], ['Setting', 'Usually outpatient'], ['Anesthesia', 'General for young children; local with sedation for older children and adults'], ['Surgery time', 'About two to three hours']],
  timeline: [
    ['Surgery day', 'Ear surgery usually takes about two to three hours, though complicated procedures may take longer. It is usually performed as an outpatient procedure.'],
    ['First days', 'Adults and children are usually up and around within a few hours. The head is wrapped in a bulky bandage for the best molding and healing. The ears may throb or ache a little for a few days, which medication can relieve.'],
    ['First weeks', 'Within a few days the bulky bandage is replaced by a lighter, headband-like dressing. Your surgeon will give specific guidance on activities and on how long to wear it.']],
  faq: [
    ['Is ear surgery only for children?', 'No. It is performed on children and on adults, and the approach to anesthesia differs by age.'],
    ['What kind of anesthesia is used?', 'If a child is young, general anesthesia may be recommended so the child sleeps through the operation. For older children or adults, local anesthesia with a sedative is often preferred, so you are awake but relaxed.'],
    ['How long does the surgery take?', 'About two to three hours, although complicated procedures may take longer.']]
},

/* ============================= BREAST ============================= */
'breast-augmentation': {
  overview: ['Breast augmentation (augmentation mammoplasty) enhances the size and shape of the breast. Women choose it for many personal reasons: to feel better proportioned, to restore volume lost after pregnancy or weight loss, to improve symmetry, or as part of a lift or reconstruction.',
             'By placing an implant behind each breast, a surgeon can increase the bust line by one or more bra cup sizes. Implant type, size and shape are chosen around your anatomy, your body type and the look you want.'],
  good: ['You are looking for improvement, not perfection', 'You are physically healthy and realistic about the outcome', 'You want proportions that suit your body', 'Your breasts have finished developing'],
  glance: [['Type', 'Surgical'], ['Implants', 'Silicone or saline, chosen with you'], ['Anesthesia', 'Usually general'], ['Back to work', 'Within a few days, depending on your job']],
  timeline: [
    ['Before', 'Your surgeon will give instructions on eating, drinking, smoking, vitamins and medications. A mammogram may be recommended beforehand as a baseline for future comparison. You will also discuss anesthesia, recovery and where the procedure will be performed.'],
    ['Surgery day', 'Usually done under general anesthesia, so you sleep through it, though some surgeons use local anesthesia with a sedative. It may take place in an office facility, a surgery center or a hospital outpatient facility. The incision can be under the breast, around the areola or in the armpit, placed so scars are as inconspicuous as possible.'],
    ['First days and weeks', 'You should be able to return to work within a few days, depending on your job. Follow your surgeon’s advice on exercise and activities. Your breasts will probably be sensitive to direct stimulation for two to three weeks.'],
    ['Weeks three to six', 'Contact is fine once your breasts are no longer sore, usually three to four weeks after surgery. Scars will be firm and pink for at least six weeks.'],
    ['Long term', 'Follow up as directed to check your implants. Whether or not you have implants, monthly self-exams and regular breast screenings stay important.']],
  faq: [
    ['Where will the incision be?', 'It can be made in the crease where the breast meets the chest, around the areola, or in the armpit. A saline implant may also be placed through an incision at the navel. The choice depends on your anatomy and your surgeon’s recommendation.'],
    ['Will I be asleep?', 'Breast augmentation is usually performed under general anesthesia, so you sleep through the operation. Some surgeons use local anesthesia with a sedative, so you are relaxed but awake.'],
    ['How soon can I go back to work?', 'Many people return within a few days, depending on how active their job is. Follow your surgeon’s advice on when to begin exercise and normal activities.'],
    ['Will I need follow-up after surgery?', 'Yes. Even if your implants seem to be working well, follow up as directed to assess their condition. Monthly breast self-exams and regular screenings remain essential.']]
},
'breast-lift': {
  overview: ['A breast lift (mastopexy) raises and reshapes breasts that have changed with age, pregnancy or weight change. The most common technique uses an anchor-shaped incision that follows the natural contour of the breast: excess skin is removed and the nipple and areola are moved to a higher position.',
             'The best results are usually achieved in women with small, sagging breasts, though breasts of any size can be lifted. It may be combined with implants if that fits your goals.'],
  good: ['Your breasts have lost firmness or sag lower than you would like', 'You are healthy, emotionally stable and realistic about what surgery can accomplish', 'You understand that a lift is shaped by the breast, not by implants alone', 'You are comfortable with the placement of scars'],
  glance: [['Type', 'Surgical'], ['Setting', 'Usually outpatient'], ['Anesthesia', 'Usually general'], ['Surgery time', 'About 1½ to 3½ hours']],
  timeline: [
    ['Before', 'Depending on your age and family history, your surgeon may ask for a mammogram first. Follow instructions on eating, drinking, smoking and medications, and arrange a ride home and help for a few days.'],
    ['Surgery day', 'Usually under general anesthesia, so you sleep through it; in selected patients a local anesthetic with sedation may be used. It usually takes one and a half to three and a half hours.'],
    ['First days', 'You will wear an elastic bandage or surgical bra over gauze. Your breasts will be bruised, swollen and uncomfortable for a day or two, though the pain shouldn’t be severe. Within a few days this changes to a soft support bra, worn around the clock for three to four weeks.'],
    ['First weeks', 'You may be up and about in a day or two, but don’t plan on returning to work for a week or more. Stitches come out after a week or two. Avoid lifting anything over your head for three to four weeks, and strenuous sports for about a month.'],
    ['Long term', 'Scars are extensive and permanent. They often stay lumpy and red for months, then become less obvious, sometimes fading to thin white lines. Gravity, pregnancy, aging and weight changes continue to affect the breasts.']],
  faq: [
    ['How long does a breast lift take?', 'Usually one and a half to three and a half hours.'],
    ['Where will the scars be?', 'The common technique uses an anchor-shaped incision that follows the natural contour of the breast. Scars are extensive and permanent, but can usually be placed so you can wear even low-cut tops, and they often fade over time.'],
    ['Will a breast lift last forever?', 'A lift will not keep you firm forever. Gravity, pregnancy, aging and weight changes continue to affect your breasts.'],
    ['When can I exercise again?', 'Avoid lifting anything over your head for three to four weeks and strenuous sports for about a month. Your surgeon will give you detailed instructions for resuming normal activities.']]
},
'breast-reduction': {
  overview: ['Breast reduction is usually performed for physical relief rather than simply cosmetic improvement. Most women who have it are troubled by very large, sagging breasts that restrict their activities and cause discomfort.',
             'The surgeon removes excess glandular tissue, fat and skin and moves the nipple and areola into their new position, reshaping the breast. In most cases it isn’t performed until the breasts are fully developed.'],
  good: ['Very large breasts restrict your activities or cause you physical discomfort', 'Your breasts are fully developed', 'You are mature enough to understand the procedure and have realistic expectations', 'You understand that the scars are extensive and permanent'],
  glance: [['Type', 'Surgical'], ['Anesthesia', 'Nearly always general'], ['Surgery time', 'Usually two to four hours'], ['Back to work', 'About two weeks for most women']],
  timeline: [
    ['Before', 'Your surgeon may require a mammogram first and will give instructions on eating, drinking, smoking, vitamins and medications. Some surgeons suggest dieting before the operation.'],
    ['Surgery day', 'Nearly always under general anesthesia. It may take place in a hospital, an outpatient surgery center or an office-based surgical suite, and usually takes two to four hours. The most common technique uses an anchor-shaped incision.'],
    ['First days', 'You will be wrapped in an elastic bandage or surgical bra. A small tube may drain fluid for the first day or two. You may feel pain for a couple of days, especially when you move or cough, and some discomfort for a week or more.'],
    ['First weeks', 'You may be up and about in a day or two, but your breasts may ache occasionally for a couple of weeks. Avoid lifting or pushing anything heavy for three or four weeks. Most women return to work and social activities in about two weeks, with less stamina for several weeks.'],
    ['Months ahead', 'Swelling and bruising mostly fade in the first few weeks, but it may be six months to a year before your breasts settle into their new shape. Scars are extensive and permanent, though they gradually become less obvious.']],
  faq: [
    ['Why do women have breast reduction?', 'It is usually performed for physical relief rather than simply cosmetic improvement. Many women are troubled by very large, sagging breasts that restrict their activities and cause discomfort.'],
    ['How long does the surgery take?', 'Usually two to four hours, but longer in some cases.'],
    ['When will I see my final shape?', 'Much of the swelling and bruising disappears in the first few weeks, but it may be six months to a year before your breasts settle into their new shape. Hormonal shifts, weight changes and pregnancy can change it later.'],
    ['When can I go back to work?', 'Most women can return to work, if it isn’t too strenuous, and to social activities in about two weeks.']]
},
'breast-reconstruction': {
  overview: ['Breast reconstruction helps restore the shape of the breast after mastectomy or injury. It is a personal journey, and many women choose to have it at the same time as the mastectomy while others wait, for legitimate reasons.',
             'There are many options. The most common technique combines skin expansion with a later implant; others use your own tissue. You and your surgeon will choose the approach that is best for you.'],
  glance: [['Type', 'Surgical'], ['Stages', 'Usually more than one operation'], ['Anesthesia', 'First stage is almost always general'], ['Hospital stay', 'Often two to five days']],
  timeline: [
    ['Deciding when', 'Many women have reconstruction at the same time as the mastectomy; others wait. There are legitimate reasons to wait, including coping with a diagnosis or not wanting more surgery than necessary.'],
    ['First stage', 'Creating the breast mound is almost always done under general anesthesia and usually in a hospital. Depending on the extent of surgery you will probably be released in two to five days.'],
    ['First weeks', 'You are likely to feel tired and sore for a week or two, which medication can control. Drains are usually removed within the first week or two, and most stitches in a week to 10 days.'],
    ['Follow-up procedures', 'Reconstruction usually involves more than one operation. Follow-up procedures may need only local anesthesia with a sedative, and may be done in a hospital or an outpatient facility.'],
    ['Long term', 'It may take up to six weeks to recover from a combined mastectomy and reconstruction or from flap reconstruction alone. Scars fade substantially, though it can take a year or two, and they never disappear entirely.']],
  faq: [
    ['When can reconstruction be done?', 'Many mastectomy patients are medically appropriate for reconstruction, often at the same time as the mastectomy. Some women choose or are advised to wait, and there are legitimate reasons for that.'],
    ['Will it take more than one operation?', 'Usually, yes. The first stage creates the breast mound, and follow-up procedures refine the result.'],
    ['Will I have feeling in the reconstructed breast?', 'Reconstruction cannot restore normal sensation, but in time some feeling may return.'],
    ['Will it match my other breast?', 'A reconstructed breast may feel firmer and look rounder or flatter than your natural breast, and it will not exactly match. These differences are usually apparent only to you. For most patients, reconstruction dramatically improves appearance and quality of life after surgery.']]
},
'male-breast-reduction': {
  overview: ['Male breast reduction corrects enlarged male breasts (gynecomastia). If excess glandular tissue is the cause, it is removed, alone or with liposuction. A typical incision is placed inconspicuously, on the edge of the areola or in the underarm area.',
             'The surgery can be performed on healthy, emotionally stable men of any age. The results are significant and permanent.'],
  good: ['You are healthy and emotionally stable', 'Your skin is firm and elastic enough to reshape to the new contour', 'You have tried exercise or weight loss first, if you are overweight', 'You understand that heavy alcohol, marijuana or steroid use can affect candidacy'],
  glance: [['Type', 'Surgical'], ['Setting', 'Most often outpatient'], ['Anesthesia', 'General, or local with sedation'], ['Surgery time', 'About an hour and a half']],
  timeline: [
    ['Before', 'Follow instructions on eating, drinking, vitamins and medications. Smokers should stop for a minimum of one or two weeks before surgery and during recovery, because smoking interferes with healing.'],
    ['Surgery day', 'Most often an outpatient procedure that takes about an hour and a half, longer for more extensive work. Excess glandular tissue is cut away, alone or with liposuction. More extensive correction may use general anesthesia.'],
    ['First days', 'You will feel some discomfort for a few days, which medication can control. You will be swollen and bruised for a while, and you may be asked to wear an elastic pressure garment to reduce swelling.'],
    ['Long term', 'The results are significant and permanent. If your expectations are realistic, chances are good you will be very satisfied with your new look.']],
  faq: [
    ['Who is a good candidate?', 'Healthy, emotionally stable men of any age with firm, elastic skin. Surgery may be discouraged for obese men, or for overweight men who haven’t first tried exercise or weight loss, and for men who drink excessively or use marijuana or steroids.'],
    ['How long does the surgery take?', 'About an hour and a half, though more extensive procedures can take longer.'],
    ['Is it permanent?', 'The results of the procedure are significant and permanent.'],
    ['Will I need to wear a compression garment?', 'You will probably be asked to wear an elastic pressure garment to help reduce swelling.']]
},

/* ============================== BODY ============================== */
'tummy-tuck': {
  overview: ['Abdominoplasty, known as a tummy tuck, is a major surgical procedure that removes excess skin and fat from the middle and lower abdomen and can tighten the abdominal muscles.',
             'It is often chosen by people who are in relatively good shape but bothered by loose skin or a fat deposit that doesn’t respond to diet and exercise, including after pregnancy or major weight loss.'],
  good: ['You are in relatively good shape but bothered by loose abdominal skin or a stubborn fat deposit', 'Your weight is stable (if you plan to lose a lot, it is usually best to wait)', 'You are done having children, or are comfortable waiting', 'You are physically healthy and realistic about the result'],
  glance: [['Type', 'Surgical'], ['Surgery time', 'Complete: two to five hours. Partial: one or two hours'], ['Anesthesia', 'General, or local with sedation'], ['Back to work', 'Roughly two to four weeks']],
  timeline: [
    ['Before', 'If you smoke, plan to quit at least one to two weeks before surgery and not resume for at least two weeks after. Avoid overexposing your abdomen to the sun and don’t go on a stringent diet, since both can slow healing. Tell your surgeon if you develop a cold or infection.'],
    ['Surgery day', 'A complete abdominoplasty usually takes two to five hours; a partial one, an hour or two. The most common approach uses a long incision from hipbone to hipbone just above the pubic area, plus a second to free the navel. It may be done in an outpatient surgical center, an office-based facility or a hospital.'],
    ['First days', 'Your abdomen will probably be swollen, with some pain that medication can control. You may not be able to stand straight at first, but you should start walking as soon as possible. Depending on the surgery, you may go home within hours or stay two to three days.'],
    ['First weeks', 'It can take weeks or months to feel like yourself again. Some people return to work after two weeks and others take three or four. Gentle exercise helps healing; avoid vigorous exercise for a while.'],
    ['Long term', 'Results are usually long lasting if you follow a balanced diet and exercise regularly. Be prepared for a permanent scar and a lengthy recovery.']],
  faq: [
    ['How long does a tummy tuck take?', 'A complete abdominoplasty usually takes two to five hours, depending on the work required. A partial abdominoplasty may take an hour or two.'],
    ['Will I need to stay in the hospital?', 'Many surgeons perform partial and complete abdominoplasties in an outpatient surgical center or office-based facility. Depending on the extent of surgery, you may go home within a few hours or stay two to three days.'],
    ['When can I go back to work?', 'Some people return after two weeks, while others take three or four weeks to rest and recover. If you start out in top physical condition with strong abdominal muscles, recovery is faster.'],
    ['Should I wait if I plan to lose weight or have more children?', 'Yes. Patients who intend to lose a lot of weight should postpone the surgery, and women who plan future pregnancies should wait.']]
},
'liposuction': {
  overview: ['Liposuction removes localized deposits of fat to recontour one or more areas of the body. Through a tiny incision, a narrow tube (cannula) is used to vacuum the fat layer beneath the skin.',
             'The best candidates are normal-weight people with firm, elastic skin who have realistic expectations. Several techniques can improve the ease of the procedure and the outcome.'],
  good: ['You are a normal-weight person with firm, elastic skin', 'You have localized fat deposits that don’t respond to diet and exercise', 'You have realistic expectations about what liposuction can do', 'You are physically healthy'],
  glance: [['Type', 'Surgical'], ['Setting', 'Usually outpatient for smaller volumes'], ['Back to work', 'Often within a few days'], ['Final contour', 'About three months']],
  timeline: [
    ['Before', 'Follow your surgeon’s instructions on eating, drinking, smoking, vitamins, iron tablets and medications. If you develop a cold or any infection, especially of the skin, surgery may need to be postponed. Arrange a ride home and help for a few days.'],
    ['Surgery day', 'How long it takes depends on the size of the area, the amount of fat removed, the type of anesthesia and the technique. Smaller-volume liposuction is usually done on an outpatient basis. A large volume, or liposuction combined with other procedures, may need a hospital or overnight stay.'],
    ['First days', 'Expect some fluid drainage from the incisions. A small drain may be placed for a couple of days, and you may wear a snug elastic garment for a few weeks to control swelling. Don’t expect to look or feel great right after surgery.'],
    ['First weeks', 'Start walking as soon as possible to reduce swelling. You may feel better after a week or two and be back at work within a few days. Stitches come out or dissolve within a week to 10 days. Avoid strenuous activity for about a month.'],
    ['Months ahead', 'You will see a noticeable difference in shape fairly soon. It becomes more apparent after about four to six weeks, when most of the swelling has subsided, and after about three months the final contour is visible.']],
  faq: [
    ['Who is a good candidate for liposuction?', 'The best candidates are normal-weight people with firm, elastic skin and realistic expectations, who have localized fat deposits.'],
    ['How long until I see my final result?', 'You will see a difference fairly soon. It becomes more apparent after about four to six weeks, when most swelling has subsided, and after about three months the final contour is visible.'],
    ['Will I wear a compression garment?', 'You may be fitted with a snug elastic garment to wear over the treated area for a few weeks, to control swelling and help your skin fit its new contours.'],
    ['Where is liposuction performed?', 'It may be done in a surgeon’s office-based facility, an outpatient surgery center or a hospital. Smaller volumes are usually outpatient; a large volume, or surgery combined with other procedures, may need a longer stay.']]
},

/* ========================== NON-SURGICAL ========================== */
'botox': {
  overview: ['Botox temporarily softens the expression lines that form with repeated movement, such as frown lines between the brows and crow’s feet.',
             'Your provider injects the specific muscles behind those lines to temporarily reduce their activity, so the lines appear smoother. Treatments are quick, and many people schedule regular visits.'],
  glance: [['Type', 'Non-surgical'], ['Treatment', 'Usually a short visit'], ['Downtime', 'Little to none'], ['Areas', 'Frown lines and crow’s feet']],
  faq: [
    ['What does Botox Cosmetic treat?', 'It is approved to temporarily improve the appearance of moderate to severe frown lines between the brows and crow’s feet lines in adults.'],
    ['How does it work?', 'Botox Cosmetic targets the repeated muscle contractions from frowning and squinting that underlie those lines. Injected into those muscles, it temporarily reduces their activity, so the lines look smoother.'],
    ['Where are the injections placed?', 'For frown lines, a specialist injects the muscles between the brows. For crow’s feet, injections are placed in three areas of the muscle that frames the side of each eye.']]
},
'halo-laser': {
  overview: ['Over time, sun exposure and aging can leave skin with sun spots, fine lines and a lost glow. Halo is a hybrid fractional laser that treats tone, texture and fine lines in a single session.',
             'Older lasers were either too shallow or too deep to treat this damage well. Halo combines deep dermal rejuvenation with epidermal renewal, with less downtime than traditional resurfacing.'],
  glance: [['Type', 'Non-surgical'], ['Customizable', 'Light to more intense treatment levels'], ['Downtime', 'Minimal; varies by level'], ['Treats', 'Tone, texture, pores, fine lines']],
  faq: [
    ['What does Halo treat?', 'Discoloration, sun damage, visible signs of aging, uneven skin tone, enlarged pores and poor texture. Fine lines and scar revision are treated with Halo Hybrid treatments.'],
    ['Will I have downtime?', 'It depends on the level you choose. A light treatment can leave skin smooth and ready for makeup the next day; a more intense treatment gives more dramatic results with more downtime. Your clinician customizes it to your lifestyle.'],
    ['What makes Halo different from older lasers?', 'Earlier lasers were either too shallow or too deep to treat this kind of damage effectively. Halo combines deep dermal rejuvenation with epidermal renewal.']]
},
'microneedling': {
  overview: ['SkinPen is a vertical microneedling device that creates hundreds of microscopic channels in the skin, stimulating its natural production of collagen and elastin.',
             'Its needle depth can be adjusted from 0.25 mm up to 2.5 mm, so treatment can be tailored to your skin’s thickness and your goals, for example more depth for acne scarring.'],
  glance: [['Type', 'Non-surgical'], ['Treats', 'Fine lines, acne scars, texture'], ['Needle depth', 'Adjustable, 0.25 to 2.5 mm'], ['Setting', 'Quick in-office treatment']],
  faq: [
    ['What can SkinPen treat?', 'Fine lines and wrinkles, acne scars, hyperpigmentation, stretch marks and skin texture.'],
    ['How does microneedling work?', 'It uses the body’s natural healing response, known as collagen induction therapy. The tiny channels trigger inflammation, then proliferation of new cells, then remodeling that builds new collagen and elastin.'],
    ['Can the treatment be adjusted for my skin?', 'Yes. Needle depth can be adjusted from 0.25 mm to 2.5 mm, so your provider can tailor treatment to your skin thickness and your needs.']]
},
'miradry': {
  overview: ['miraDry is a physician-approved, no-surgery treatment for excessive underarm sweat. It is a simple in-office procedure, with aftercare of ice on the area and a little rest.',
             'It is a popular alternative for people who rely on antiperspirants. A follow-up appointment lets the doctor check the area.'],
  glance: [['Type', 'Non-surgical'], ['Setting', 'In-office'], ['Aftercare', 'Ice and a little rest'], ['Treatments', 'As few as one']],
  faq: [
    ['Is miraDry surgery?', 'No. It is a physician-approved, no-surgery solution to excessive sweating, done as a simple in-office procedure.'],
    ['What is the aftercare?', 'Aftercare is ice on the area and a little rest. A follow-up appointment lets the doctor check the skin and make sure you are caring for it properly.'],
    ['How many treatments will I need?', 'The practice describes results from as little as one treatment. Your provider will advise you at your consultation.']]
}
};
