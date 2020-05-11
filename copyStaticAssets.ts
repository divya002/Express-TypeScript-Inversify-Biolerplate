import * as shell from "shelljs";

shell.cp("-R", "src/public/json", "build/public/json/");
shell.cp("-R", "src/public/images", "build/public/");

