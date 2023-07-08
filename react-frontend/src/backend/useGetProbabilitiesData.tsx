import queryBackend from "./BackendQueryEngine";
import {useState} from "react";

const useGetProbabilitiesData = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [probs, setProbs] = useState<{ census: number, he_prob: number, she_prob: number, profession: string }[]>([]);

    function reset() {
        setLoading(false);
        setError("");
    }

    async function exec() {
        try {
            setLoading(true);
            setError("");

            await queryBackend(`static/probs`).then((response: {probabilities: { census: number, he_prob: number, she_prob: number, profession: string }[]}) => {
                setProbs(response['probabilities']);
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

    return [loading, error, probs, exec, reset] as const;
}

export default useGetProbabilitiesData;