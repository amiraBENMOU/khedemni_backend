import path from "path";
import fs from "fs";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import util from "util";
import isDev from "./isDev.js";
import registerPartials from "./registerPartials.js";

const getPdf = async (html, options = { format: "A4" }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf(options);
  await browser.close();
  return pdfBuffer;
};

// Templates path
const templatesPath = isDev()
  ? path.join(process.cwd(), "view")
  : path.join(process.cwd(), "view");

const readFile = util.promisify(fs.readFile);

const buildReport = async (template, data, options) => {
  // Register partials
  registerPartials("view");

  // Read and compile the template
  const templatePath = path.join(templatesPath, template);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${template}`);
  }
  const templateContent = await readFile(templatePath, "utf8");
  const compiledTemplate = handlebars.compile(templateContent);
  const html = compiledTemplate(data);

   // Log the compiled HTML to verify data insertion
   console.log("Compiled HTML:", html);

   
  // Generate PDF
  const pdfBuffer = await getPdf(html, options);
  return pdfBuffer;
};

export default buildReport;