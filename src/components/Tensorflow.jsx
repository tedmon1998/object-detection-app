// для того, чтобы подружить камеру тенсор с экспо
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
// модель обученная
import * as mobilenet from '@tensorflow-models/mobilenet'
// тенсорфлоу
import * as tf from "@tensorflow/tfjs";
// компоненты нативные компоненты
import { StyleSheet, Platform, Text, View } from 'react-native'
// библиотека реакт
import React, { useEffect, useState } from "react";

// рамка
let frame = 0;
// частота распознования
const computeRecognitionEveryNFrames = 60;

// разрешение кемры в зависимости от платформы (брал с интернета не типа оптимальное значение)
const textureDims = Platform.OS === 'ios' ? {
    height: 1920,
    width: 1080,
} : {
    height: 1200,
    width: 1600,
}
export const Tensorflow = ({ camera }) => {

    // инициализация камеры тенсор
    const TensorCamera = cameraWithTensors(camera)
    // создание при помощи хука useState переменных для хранения определенных(распознанных) 
    // объектов и моделей (сети) 
    const [model, setModel] = useState(null);
    const [detections, setDetections] = useState([])

    // инициализация тенсорфлоу
    const initialiseTensorflow = async () => {
        await tf.ready();
        tf.getBackend();
    }

    // функция которая принимает фотографию с камеры и распознает объекты на нем
    const handleCameraStream = (images) => {
        const loop = async () => {
            if (model) {
                // проверяет, что пришло время распознать
                if (frame % computeRecognitionEveryNFrames === 0) {
                    // делает снимок
                    const nextImageTensor = images.next().value;
                    // если есть снимок (не пустой)
                    if (nextImageTensor) {
                        // при помощи модели определяет объекты
                        const objects = await model.classify(nextImageTensor);
                        if (objects && objects.length > 0) {
                            // добавляет объекты, которые определил в массив при помощи хука
                            setDetections(objects.map(object => object.className));
                        }
                        tf.dispose([nextImageTensor]);
                    }
                }
                frame += 1;
                frame = frame % computeRecognitionEveryNFrames;
            }

            requestAnimationFrame(loop);
        }
        loop();
    }

    // срабатывает при первом запуске (следовательно просто вызывает поочередную инициализацию)
    useEffect(() => {
        (async () => {
            await initialiseTensorflow()
            // при помощи объекта, который в load можно улучшить или ускорить распознование
            setModel(await mobilenet.load({ version: 1, alpha: 0.25 }));
        })()
    }, [])


    if (model === null)
        return <Text>Model not loaded</Text>
    //  просто применнение компонентов для работы с камерой и отображения массива
    return (
        <View style={styles.container}>
            <TensorCamera
                style={styles.camera}
                type={camera.Constants.Type.back}
                onReady={handleCameraStream}
                resizeHeight={200}
                resizeWidth={152}
                resizeDepth={3}
                autorender={true}
                useCustomShadersToResize={false}
                cameraTextureHeight={textureDims.height}
                cameraTextureWidth={textureDims.width}
            />
            {detections &&
                <View style={styles.text} >
                    {detections.map((detection, index) =>
                        <Text key={index}>{detection}</Text>
                    )}
                </View>
            }
        </View>
    )
}
// стили компонентов
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        flex: 1,
    },
    camera: {
        flex: 10,
        width: '100%',
    },
})