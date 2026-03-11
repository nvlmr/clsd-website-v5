// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\services\organizational_structure_api.js
import localExperts from '../data/OrganizationalStructure.js';

// Get environment variables - NO FALLBACKS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL;
const ORGANIZATIONAL_STRUCTURE_ENDPOINT = import.meta.env.VITE_ORGANIZATIONAL_STRUCTURE_ENDPOINT;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const organizationalStructureApi = {
    async fetchExperts() {
        if (USE_MOCK_DATA) {
            return this.getLocalExperts();
        }

        try {
            const response = await fetch(`${API_BASE_URL}${ORGANIZATIONAL_STRUCTURE_ENDPOINT}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API fetch error:', error);
            console.warn('Falling back to local expert data');
            return this.getLocalExperts();
        }
    },

    mapExpertData(person) {
        return {
            id: person.id,
            user_id: person.id,
            first_name: person.first_name,
            middle_name: person.middle_name || '',
            last_name: person.last_name,
            suffix: person.suffix || '',
            name: `${person.first_name} ${person.middle_name ? person.middle_name + ' ' : ''}${person.last_name}${person.suffix ? ', ' + person.suffix : ''}`,
            title: person.designation,
            designation: person.designation,
            department: person.department,
            institution: person.institution,
            expertise: person.research_interest,
            qualifications: person.research_interest,
            research_interest: person.research_interest,
            image: person.image ? 
                `${UPLOADS_BASE_URL}/research/${person.image}` : 
                `https://via.placeholder.com/150?text=${person.first_name}+${person.last_name}`
        };
    },

    mapLocalExpertData(person) {
        return {
            ...person,
            name: `${person.first_name} ${person.middle_name ? person.middle_name + ' ' : ''}${person.last_name}${person.suffix ? ', ' + person.suffix : ''}`,
            title: person.designation,
            expertise: person.research_interest,
            qualifications: person.research_interest
        };
    },

    getLocalExperts() {
        return localExperts.map(this.mapLocalExpertData);
    },

    async getExperts() {
        const data = await this.fetchExperts();
        
        if (Array.isArray(data)) {
            return data;
        } else if (data && data.success && Array.isArray(data.data)) {
            return data.data.map(person => this.mapExpertData(person));
        } else if (data && Array.isArray(data.data)) {
            return data.data.map(person => this.mapExpertData(person));
        } else {
            console.warn('Unexpected data format, using local experts');
            return this.getLocalExperts();
        }
    },

    async getExpertById(id) {
        const experts = await this.getExperts();
        return experts.find(expert => expert.id === parseInt(id)) || null;
    },

    async getExpertsByDepartment(department) {
        const experts = await this.getExperts();
        return experts.filter(expert => expert.department === department);
    },

    async getExpertsByExpertise(expertise) {
        const experts = await this.getExperts();
        return experts.filter(expert => 
            expert.expertise && expert.expertise.toLowerCase().includes(expertise.toLowerCase())
        );
    }
};

export default organizationalStructureApi;