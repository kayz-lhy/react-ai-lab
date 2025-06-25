// src/pages/YoloV5TrainingPage.tsx
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

const YoloV5TrainingPage: React.FC = () => {
    const [weightsPath, setWeightsPath] = useState("");
    const [dataYaml, setDataYaml] = useState("");
    const [epochs, setEpochs] = useState(100);
    const [imgSize, setImgSize] = useState(640);
    const [batchSize, setBatchSize] = useState(16);

    const handleStartTraining = () => {
        // TODO: 调用实际启动训练逻辑
        console.log({
            weightsPath,
            dataYaml,
            epochs,
            imgSize,
            batchSize,
        });
        alert("开始训练模型...");
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <h1 className="text-2xl font-semibold mb-6">YOLOv5 模型训练配置</h1>

            <Card title="模型设置" className="max-w-2xl mb-8">
                <div className="space-y-6">
                    <div>
                        <label className="block mb-1 text-sm font-medium">预训练权重文件路径</label>
                        <Input
                            placeholder="./yolov5s.pt"
                            value={weightsPath}
                            onChange={(e) => setWeightsPath(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">数据集配置 YAML 路径</label>
                        <Input
                            placeholder="./data/coco.yaml"
                            value={dataYaml}
                            onChange={(e) => setDataYaml(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">训练 Epochs</label>
                            <Input
                                type="number"
                                value={epochs}
                                onChange={(e) => setEpochs(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">输入图像大小</label>
                            <Input
                                type="number"
                                value={imgSize}
                                onChange={(e) => setImgSize(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">批大小 (Batch Size)</label>
                        <Input
                            type="number"
                            value={batchSize}
                            onChange={(e) => setBatchSize(Number(e.target.value))}
                        />
                    </div>

                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                        <Button variant="primary" size="medium" onClick={handleStartTraining}>
                            开始训练
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default YoloV5TrainingPage;
