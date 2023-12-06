const path = require("path");
const getAllFiles = require("./getAllFiles");
module.exports = (exepctions = []) => {
  let localContextMenus = [];
  const menuFiles = getAllFiles(path.join(__dirname, "..", "contextmenus"));

  for (const menuFile of menuFiles) {
    const menuobject = require(menuFile);

    if (exepctions.includes(menuobject.name)) continue;
    localContextMenus.push(menuobject);

    return localContextMenus;
  }
};
