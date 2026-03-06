import { useState, useEffect } from 'react';
import localExperts from '../data/ResearchTeam.js';

const API_BASE_URL = 'http://localhost/clsd-backend/public';

export function useResearchTeam() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get_research_team.php`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.status === 'success' && result.data && result.data.length > 0) {
                    // Map the database fields to match your component's expected structure
                    const mappedExperts = result.data.map(person => ({
                        id: person.id,
                        user_id: person.id,
                        first_name: person.first_name,
                        middle_name: person.middle_name || '',
                        last_name: person.last_name,
                        suffix: person.suffix || '',
                        // Combine name fields for display
                        name: `${person.first_name} ${person.middle_name ? person.middle_name + ' ' : ''}${person.last_name}${person.suffix ? ', ' + person.suffix : ''}`,
                        // Create title from designation and department
                        title: person.designation,
                        designation: person.designation,
                        department: person.department,
                        institution: person.institution,
                        expertise: person.research_interest,
                        qualifications: person.research_interest,
                        research_interest: person.research_interest,
                        // Use database image when available
                        image: person.image ? 
                            `${API_BASE_URL}/uploads/research/${person.image}` : // Assuming images are stored in an 'uploads' folder
                            `https://via.placeholder.com/150?text=${person.first_name}+${person.last_name}`
                    }));
                    
                    setExperts(mappedExperts);
                    setIsLive(true);
                } else {
                    // Use local data as fallback
                    console.log('Using local data as fallback');
                    const mappedLocalExperts = localExperts.map(person => ({
                        ...person,
                        name: `${person.first_name} ${person.middle_name ? person.middle_name + ' ' : ''}${person.last_name}${person.suffix ? ', ' + person.suffix : ''}`,
                        title: person.designation,
                        expertise: person.research_interest,
                        qualifications: person.research_interest
                    }));
                    setExperts(mappedLocalExperts);
                    setIsLive(false);
                }
            } catch (err) {
                console.error('Error fetching experts:', err);
                setError(err.message);
                // Use local data as fallback on error
                const mappedLocalExperts = localExperts.map(person => ({
                    ...person,
                    name: `${person.first_name} ${person.middle_name ? person.middle_name + ' ' : ''}${person.last_name}${person.suffix ? ', ' + person.suffix : ''}`,
                    title: person.designation,
                    expertise: person.research_interest,
                    qualifications: person.research_interest
                }));
                setExperts(mappedLocalExperts);
                setIsLive(false);
            } finally {
                setLoading(false);
            }
        };

        fetchExperts();
    }, []);

    return { experts, loading, error, isLive };
}