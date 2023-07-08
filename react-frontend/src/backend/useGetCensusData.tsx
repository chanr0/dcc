import queryBackend from "./BackendQueryEngine";
import {useState} from "react";

const useGetCensusData = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [census, setCensus] = useState<{ [key: string]: number }>({});

    function reset() {
        setLoading(false);
        setError("");
    }

    async function exec() {
        try {
            setLoading(true);
            setError("");

            await queryBackend(`static/census`).then((response: {census: { [key: string]: number }}) => {
                setCensus(response['census']);
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

    return [loading, error, census, exec, reset] as const;
}

export default useGetCensusData;