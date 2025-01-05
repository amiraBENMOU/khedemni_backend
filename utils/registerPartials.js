import path from "path";
import handlebars from "handlebars";
import fs from "fs";

function registerPartials(directory) {
  const partialsDir = path.join(process.cwd(), directory);

  function readPartials(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        readPartials(filePath);
      } else if (stat.isFile() && file.endsWith(".hbs")) {
        const name = path
          .relative(partialsDir, filePath)
          .replace(/\\/g, "/")
          .replace(/\.hbs$/, "");
        const template = fs.readFileSync(filePath, "utf8");
        handlebars.registerPartial(name, template);
      }
    });
  }

  readPartials(partialsDir);
}

export default  registerPartials;
