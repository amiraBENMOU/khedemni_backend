import { Router } from "express";
import puppeteer from "puppeteer";
import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from "../controllers/contact.js";
import path from "path";
import { engine } from "express-handlebars";
import fs from "fs";
import util from "util";


const contactRouter = Router();

contactRouter.post("/createContact", createContact);

contactRouter.get("/getContacts", getContacts);

contactRouter.get("/:id/getContact", getContactById);

contactRouter.patch("/:id/updateContact", updateContact);

contactRouter.delete("/:id/deleteContact/", deleteContact);

contactRouter.get("/:id/download-pdf", async (req, res) => {
  try {
    console.log("Starting PDF generation...");

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    console.log("Browser launched");

    const page = await browser.newPage();
    console.log("New page created");

    const contact = await getContactById(req.params.id); 
    console.log("Contact data retrieved:", contact);

    const content = await renderTemplate("contact",  {contact} );
     console.log("Template rendered");

    await page.setContent(content);
    console.log("Content set in page");

    const pdf = await page.pdf({ format: "A4" });
    console.log("PDF generated");

    await browser.close();
    console.log("Browser closed");

    res.contentType("application/pdf");
    res.send(pdf);
  } catch (error) {
    res.status(500).send("Error generating PDF");
    console.log ("Error generating PDF");
  }
});

async function renderTemplate(templateName, data) {
  const readFile = util.promisify(fs.readFile);
  const templatePath = path.join(__dirname, `../view/${templateName}.hbs`);
  const template = await readFile(templatePath, "utf8");
  const hbs = engine();
  const compiledTemplate = hbs.compile(template);
  return compiledTemplate(data);
}

export default contactRouter;