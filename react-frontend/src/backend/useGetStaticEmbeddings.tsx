import queryBackend from "./BackendQueryEngine";
import {useState} from "react";

const useGetStaticEmbeddings = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [embeddings, setEmbeddings] = useState<{ [key: string]: any }[]>([]);
    const [allLayers, setAllLayers] = useState([]);
    const [allAlgorithms, setAllAlgorithms] = useState([]);
    const [allProfessions, setAllProfessions] = useState([]);

    function reset() {
        setLoading(false);
        setError("");
    }

    async function exec() {
        try {
            setLoading(true);
            setError("");

            await queryBackend(`static/prof`).then((response: {embedding: any[], algorithms: string[], layers: number[]}) => {
                setEmbeddings(response['embedding']);
                setAllAlgorithms(response['algorithms']);
                setAllLayers(response['layers']);
                setAllProfessions(response['embedding'].filter((value, index, self) => self.map(x => x.profession).indexOf(value.profession) === index).map((embedding) => embedding.profession));
            });

            setLoading(false);
            setError('');

        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            else {
                setError("Unknown error");
            }
        }
    }

    return [loading, error, embeddings, allLayers, allAlgorithms, allProfessions, exec, reset] as const;
}

export default useGetStaticEmbeddings;