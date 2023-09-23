"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { Fragment, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Html, Environment, OrbitControls } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import Image from "next/image";

const Experience = ({ timerInterval, timerRunning, start }: { timerInterval: number | null, timerRunning: boolean, start: boolean }) => {

    const [move, setMove] = useState(0);
    const [unfinished, setFinish] = useState(true)
    const groupRef: any = useRef();
    const camera = useLoader(GLTFLoader as any, "/model/camera.glb", (loader) => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        loader.setDRACOLoader(dracoLoader);
    });
    console.log(camera);

    const rotateFunction = () => {
        if (start) {
            if (move === 0) {
                const timeLine = gsap.timeline();
                timeLine.to(groupRef.current.rotation, { y: Math.PI, duration: 1 });
                setMove(1);
            } else if (move === 1) {
                const timeLine = gsap.timeline();
                timeLine.to(groupRef.current.rotation, { x: -Math.PI / 2, duration: 1 });
                setMove(2);
            } else {
                const timeLine = gsap.timeline();
                timeLine.to(groupRef.current.rotation, { x: 0, y: 0, duration: 1 });
                setMove(0);
            }
        }
    };

    function checkCompletion() {
        const checkbox1 = document.getElementById("checkbox1") as HTMLInputElement;
        const checkbox2 = document.getElementById("checkbox2") as HTMLInputElement;
        const checkbox3 = document.getElementById("checkbox3") as HTMLInputElement;

        if (checkbox1.checked && checkbox2.checked && checkbox3.checked && timerRunning) {
            if (timerInterval && unfinished) {
                clearInterval(timerInterval);
                alert("お疲れ様でした。経過時間をコピーし、Google Formsに貼り付けてください。");
                setFinish(false)
            }
        }
    }

    return (
        <>
            <Environment preset="city" background />
            <ambientLight intensity={1} />

            <group ref={groupRef}>
                <mesh scale={50} onClick={rotateFunction}>
                    <primitive object={camera.scene} />
                </mesh>

                {start ? (
                    <>
                        <Html position={[1, 2, 4]} occlude as="div" wrapperClass="point_0">
                            <div className="h-15 w-50 bg-white flex flex-row items-center rounded-xl border-2 border-amber-900 bg-opacity-75">
                                <input type="checkbox" id="checkbox1" onClick={checkCompletion} className="h-6 w-20" />
                                <p className="h-ful w-30 ml-5 text-base text-start">標準域レンズ</p>
                            </div>
                        </Html>
                        <Html position={[2, 3, -1]} occlude as="div" wrapperClass="point_1">
                            <div className="h-15 w-50 bg-white flex flex-row items-center rounded-xl border-2 border-amber-900 bg-opacity-75">
                                <p className="h-ful w-30 mr-5 text-base text-start">ファインダー</p>
                                <input type="checkbox" id="checkbox2" onClick={checkCompletion} className="h-6 w-20" />
                            </div>
                        </Html>
                        <Html position={[0, 0, -0.5]} occlude as="div" wrapperClass="point_2">
                            <div className="h-15 w-50 bg-white flex flex-row items-center rounded-xl border-2 border-amber-900 bg-opacity-75">
                                <input type="checkbox" id="checkbox3" onClick={checkCompletion} className="h-6 w-20" />
                                <p className="h-ful w-30 ml-5 text-base text-start">革ストラップ</p>
                            </div>
                        </Html>
                    </>
                ) : null}
            </group>
        </>
    );
};

export default function Home() {
    const [start, setStart] = useState(false);

    const [timerRunning, setTimerRunning] = useState(false);
    const [timerInterval, setTimerInterval] = useState<number | null>(null);

    useEffect(() => {
        let startTime = 0;

        function updateTimer() {
            const interval: any = setInterval(() => {
                const currentTime = Date.now();
                const elapsedTime = new Date(currentTime - startTime);
                const minutes = elapsedTime.getUTCMinutes();
                const seconds = elapsedTime.getUTCSeconds();
                const milliseconds = elapsedTime.getUTCMilliseconds();
                const timer = document.getElementById("timer") as HTMLDivElement;
                if (timer) {
                    timer.innerText = `${minutes}:${seconds}.${milliseconds}`;
                }
            }, 10);
            startTime = Date.now();
            setTimerRunning(true);
            setTimerInterval(interval);
        }
        if (start) {
            updateTimer();
        }

        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, [start]);

    const startFunction = () => {
        setStart(true);
    };

    return (
        <Fragment>
            <section className="h-[100dvh] w-[100dvw] flex flex-col justify-center">
                <motion.div
                    className={`w-full h-full flex flex-col justify-center ${start ? 'h-[20dvh]' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="h-[30dvh] w-[100dvw] bg-pink-100 flex flex-row flex-wrap text-xl my-auto bg-opacity-50">
                        <ol className="h-full w-full ml-10 md:ml-20 lg:ml-56">
                            <li className="text-base my-5 underline font-bold md:text-2xl">次の ３ つのタスクを実行してください。</li>
                            <li className="text-base md:text-xl">1. ボタンAを押してください。</li>
                            <li className="text-base md:text-xl">2. 3つのチェックボックスに<span className="font-bold underline">全てチェック</span>を入れてください。</li>
                            <li className="text-base md:text-xl">3. 完了時間を記録してください</li>
                            {start ? (
                                <div>
                                    <div id="timer" className="h-[5dvh] w-[10dvw]" />
                                </div>
                            ) : (
                                <button onClick={startFunction} className="h-[5dvh] w-[10dvw] text-base font-medium text-center bg-white rounded-xl border-2 border-amber-900">ボタンA</button>
                            )}
                        </ol>
                    </div>
                    {start ? <div className="absolute z-10 bottom-20 right-20 h-[20dvh] w-[20dvh] flex flex-col bg-white text-center justify-center"><Image src="/textures/touch.svg" className="h-full w-full p-5" alt={""} width={100} height={100} /></div> : null}
                    <Canvas className="h-[70dvh] w-[100dvw]" camera={{ position: [6, 7, 25], fov: 45 }}>
                        <Experience timerInterval={timerInterval} timerRunning={timerRunning} start={start} />
                    </Canvas>
                </motion.div>
            </section>
        </Fragment>
    );
}
