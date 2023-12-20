#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Apr 23 20:17:11 2020

@author: sbergste
"""

# Logline example:
# 2020-04-23T13:19:49.623818964Z handleVibration data floor-1-line-1-extruder-1,pump-1,14.228827260599378,1587647989617
# 

f = open("raw-data.log", "r")

tofile=open('raw-data.csv', 'w') 
tofile.write("ts,id,value,label\n")

current_values = []
last_values = []

for line in f:
  
  if "handleVibration" in line:
      last_values = current_values
      current_values = line.split(" ")[3].rstrip().split(",")
      current_values.append('0')
      
      if last_values:
          print(last_values)
          ts=int(last_values[3])
          id=last_values[1]
          value = float(last_values[2])
          label=int(last_values[4]) 
          tofile.write('%d,%s,%f, %d\n' % (ts,id,value,label  ))
          
  
  if "alert" in line and current_values:
      current_values[len(current_values)-1] = 1
         
f.close()
tofile.close()  