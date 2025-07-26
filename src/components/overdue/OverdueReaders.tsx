import { useEffect, useState } from "react";
import type {Reader} from "../../types/overdue";

interface Props {
    onSelectReader: (readerId: string, readerName: string) => void;
}

const OverdueReaders: React.FC<Props> = ({ onSelectReader }) => {
    const [readers, setReaders] = useState<Reader[]>([]);

    useEffect(() => {
        fetch("/api/overdue/readers")
            .then((res) => res.json())
            .then((data) => setReaders(data))
            .catch(() => alert("Failed to load readers."));
    }, []);

    return (
        <div className="w-full lg:w-1/3 bg-white shadow rounded p-4 m-2">
            <h2 className="text-xl font-bold mb-4">Readers with Overdue Books</h2>
            {readers.length === 0 ? (
                <p>No overdue readers found.</p>
            ) : (
                <ul className="space-y-2">
                    {readers.map((reader) => (
                        <li
                            key={reader.readerId}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
                            onClick={() => onSelectReader(reader.readerId, reader.readerName)}
                        >
                            {reader.readerName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OverdueReaders;
