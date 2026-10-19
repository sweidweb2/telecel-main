"use client";

import { configureBoneyard, registerBones } from "boneyard-js/react";

// Stub registry until `npm run bones:build` captures named skeletons.
// The CLI overwrites this file and adds *.bones.json imports.
configureBoneyard({
  select: "viewport",
  animate: "pulse",
  boneClass: "rounded-md",
});

registerBones({});
