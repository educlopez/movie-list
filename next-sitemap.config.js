/** @type {import('next-sitemap').IConfig} */
module.exports = {
  changefreq: "daily",
  exclude: ["/sinpublicar/*"],
  generateRobotsTxt: true,
  priority: 0.7,
  sitemapSize: 7000,
  siteUrl: process.env.SITE_URL,
};
