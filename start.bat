@echo off
title Corgi 

if exist node_modules\ (
  node src/index.js
  pause
) else (
  call npm i >> NUL
  echo Succesfully installed, please re-run this file.
  pause
  exit
)