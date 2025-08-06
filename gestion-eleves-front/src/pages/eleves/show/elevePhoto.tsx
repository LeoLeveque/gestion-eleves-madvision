import { UploadOutlined } from "@ant-design/icons";
import { Upload, Button, message } from "antd";
import { useCustomMutation } from "@refinedev/core";
import { API_URL } from "../../../dataProvider";
import type { EleveType } from "./types";

type Props = {
    photoUrl?: string;
    eleveId: number;
    setLocalRecord: React.Dispatch<React.SetStateAction<EleveType | null>>;
};

export const ElevePhoto: React.FC<Props> = ({ photoUrl, eleveId, setLocalRecord }) => {
    const { mutate: uploadPhoto } = useCustomMutation<{ photoUrl: string }>();

    return (
        <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
            <img
                src={photoUrl ? `${API_URL}${photoUrl}` : `${API_URL}`+"/uploads/default.png"}
                alt="Photo de l'élève"
                style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginRight: 16,
                    border: "1px solid #ddd",
                }}
            />

            <Upload
                showUploadList={false}
                accept="image/*"
                customRequest={({ file, onSuccess, onError }) => {
                    const formData = new FormData();
                    formData.append("photo", file);

                    uploadPhoto(
                        {
                            url: `eleves/${eleveId}/photo`,
                            method: "post",
                            values: formData,
                            meta: {
                                contentType: "multipart/form-data",
                            },
                        },
                        {
                            onSuccess: (data) => {
                                setLocalRecord((prev) =>
                                    prev ? { ...prev, photoUrl: data.data.photoUrl } : prev
                                );
                                message.success("Photo mise à jour !");
                                onSuccess?.(data, new XMLHttpRequest());
                            },
                            onError: (error) => {
                                console.error(error);
                                message.error("Erreur lors de l’upload de la photo");
                                onError?.(error as any);
                            },
                        }
                    );
                }}
            >
                <Button icon={<UploadOutlined />}>Modifier la photo</Button>
            </Upload>
        </div>
    );
};
