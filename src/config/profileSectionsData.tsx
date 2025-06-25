

// src/config/modelTrainingConfig.ts
export interface FieldConfig {
    label: string;
    name: string;
    placeholder?: string;
    type?: "text" | "email" | "textarea" | "number" | "select";
    options?: string[]; // Used for select input type (e.g., optimizer choices)
}

export interface SectionConfig {
    key: string;
    label: string;
    title: string;
    fields?: FieldConfig[];
    description?: string;
}

// 纯数据，不包含任何JSX
export const profileSectionsData: SectionConfig[] = [
    {
        key: "data",
        label: "Data Configuration",
        title: "Data Parameters",
        fields: [
            { label: "Batch Size", name: "batch_size", placeholder: "Enter batch size", type: "number" },
            { label: "Training Data Path", name: "train_data_path", placeholder: "Path to training data" },
            { label: "Validation Data Path", name: "val_data_path", placeholder: "Path to validation data" }
        ]
    },
    {
        key: "training",
        label: "Training Parameters",
        title: "Training Configuration",
        fields: [
            { label: "Learning Rate", name: "learning_rate", placeholder: "Enter learning rate", type: "number" },
            { label: "Epochs", name: "epochs", placeholder: "Enter number of epochs", type: "number" },
            { label: "Optimizer", name: "optimizer", type: "select", options: ["SGD", "Adam", "RMSprop"] },
            { label: "Momentum", name: "momentum", placeholder: "Momentum for optimizer", type: "number" }
        ]
    },
    {
        key: "model",
        label: "Model Configuration",
        title: "Model Parameters",
        fields: [
            { label: "Model Architecture", name: "model_architecture", type: "select", options: ["ResNet", "VGG", "MobileNet"] },
            { label: "Dropout Rate", name: "dropout_rate", placeholder: "Dropout rate", type: "number" }
        ]
    },
    {
        key: "augmentation",
        label: "Augmentation",
        title: "Data Augmentation Settings",
        fields: [
            { label: "Rotation Angle", name: "rotation_angle", placeholder: "Rotation angle", type: "number" },
            { label: "Zoom Range", name: "zoom_range", placeholder: "Zoom range", type: "number" },
            { label: "Horizontal Flip", name: "horizontal_flip", type: "select", options: ["True", "False"] }
        ]
    }
];
