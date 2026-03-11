// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\hooks\OrganizationalStructure.js
import { useState, useEffect } from 'react';
import { organizationalStructureApi } from '../services/organizational_structure_api.js';

export function useResearchTeam() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const result = await organizationalStructureApi.fetchExperts();
                
                if (result.status === 'success' && result.data && result.data.length > 0) {
                    const mappedExperts = result.data.map(person => 
                        organizationalStructureApi.mapExpertData(person)
                    );
                    setExperts(mappedExperts);
                    setIsLive(true);
                } else {
                    console.log('Using local data as fallback');
                    setExperts(organizationalStructureApi.getLocalExperts());
                    setIsLive(false);
                }
            } catch (err) {
                console.error('Error fetching experts:', err);
                setError(err.message);
                setExperts(organizationalStructureApi.getLocalExperts());
                setIsLive(false);
            } finally {
                setLoading(false);
            }
        };

        fetchExperts();
    }, []);

    return { experts, loading, error, isLive };
}