# object-detection-app
A native app that detects objects that are in a photo

repository: https://github.com/tedmon1998/object-detection-app.git
if you want to create a project from scratch: expo init имя_проекта (если текущая папка то просто ".")

the project needs a node package to install it, open 
the terminal in the project folder and write:
npm i expo-gl
npm install react-native-fs --save
npm i @react-native-async-storage/async-storage
npm i @tensorflow/tfjs
npm i @tensorflow/tfjs-react-native
npm config set legacy-peer-deps true
npm i @tensorflow-models/mobilenet

repository where the trained model is taken from:
https://github.com/tensorflow/tfjs-models

packages that are imported (for a clean project):
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera'
import React, { useState, useEffect } from 'react'
import { Tensorflow } from './components/Tensorflow'
import { cameraWithTensors } from "@tensorflow/tfjs-react-native"
import * as ts from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
