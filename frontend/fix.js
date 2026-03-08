const fs = require("fs");
let c = fs.readFileSync("src/app/pages/Admin.tsx", "utf8");
c = c.replace(/\\`/g, "`");
c = c.replace(/\\\$/g, "$");
fs.writeFileSync("src/app/pages/Admin.tsx", c);
