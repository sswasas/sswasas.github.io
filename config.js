/* ==========================================================================
   EDIT ME. Everything Trent may want to change lives in this one file.
   Edit the text, prices, friends and PayPal link here.
   ========================================================================== */
window.SITE = {

  /* ---------- HOME ---------- */
  nickname: "genasvinofarm",
  role: "AI digital artist",
  kicker: "18+ / AI DIGITAL ARTIST / FURRY ART / NSFW + SFW COMMISSIONS OPEN",

  /* TODO: replace with your own about text (1 to 3 short sentences). */
  about:
    "I make NSFW and SFW furry and character art with AI. Bold designs, clean details, " +
    "and a love for strong, expressive characters. Adult characters only. Commissions are open.",

  /* Contact. Clicking the Discord button copies this username. */
  discord: "genasvinofarm",
  deviantart: "https://www.deviantart.com/genasvinofarm",

  /* TODO: edit or add skill tags. */
  tags: [
    "NSFW art", "SFW art", "AI art", "Furry art", "Character design", "Anthro",
    "Stable Diffusion", "ComfyUI", "LoRA training", "Custom packs"
  ],

  /* ---------- COMMISSIONS ---------- */
  commissionsNote: "Prices start from the listed amount. DM me on Discord to order.",
  commissionsFine: "Prices in USD. NSFW and SFW commissions available. Adult characters only.",
  tiers: [
    {
      name: "Commission 15 images",
      price: "from $15",
      desc: "A compact set for one character or a short story.",
      items: ["15 images", "High resolution", "Consistent style"]
    },
    {
      name: "Commission 30 images",
      price: "from $25",
      desc: "A bigger themed series with more poses and scenes.",
      items: ["30 images", "High resolution", "Consistent style"],
      featured: true
    },
    {
      name: "Commission 50 images",
      price: "from $40",
      desc: "A full collection for larger projects and long series.",
      items: ["50 images", "High resolution", "Consistent style"]
    }
  ],

  /* ---------- FRIENDS ---------- */
  /* Verified live on DeviantArt. "watchers" is the number used for sorting
     (highest first); "watchersLabel" is what the card shows. Numbers checked
     on public DeviantArt profile pages on 2026-10-28. Update them when you like. */
  friends: [
    { name: "LewdCanvas",         handle: "lewdcanvas",          url: "https://www.deviantart.com/lewdcanvas",          watchers: 2300, watchersLabel: "2.3K", blurb: "Character art." },
    { name: "LunarethAI",         handle: "lunarethai",          url: "https://www.deviantart.com/lunarethai",          watchers: 1100, watchersLabel: "1.1K", blurb: "Character art." },
    { name: "GenaBodybuilderfam", handle: "genabodybyuilderfam", url: "https://www.deviantart.com/genabodybyuilderfam", watchers: 831,  watchersLabel: "831",  blurb: "Character art." },
    { name: "VelvetFang AI",      handle: "velvetfangai",        url: "https://www.deviantart.com/velvetfangai",        watchers: 67,   watchersLabel: "67",   blurb: "Character art." },
    { name: "GrowthWithMe",       handle: "growthwithme",        url: "https://www.deviantart.com/growthwithme",        watchers: 49,   watchersLabel: "49",   blurb: "Character art." }
  ],

  /* ---------- SUPPORT ---------- */
  /* Put your PayPal link here, for example "https://paypal.me/yourname".
     If it is set to PAYPAL_LINK_HERE the button shows "PayPal link coming soon". */
  paypal: "https://www.paypal.com/paypalme/swasxa"
};
