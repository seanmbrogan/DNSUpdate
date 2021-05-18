@echo off
mode con: cols=72 lines=4
color a 
title DNSUpdate
cd C:\wamp\websites\Node
node DNSUpdate\DNSUpdate.js
pause>nul
