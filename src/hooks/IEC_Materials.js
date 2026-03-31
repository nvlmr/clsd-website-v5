// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\hooks\IEC_Materials.js

import { useState, useEffect, useCallback } from 'react';
import { fetchIECMaterials, fetchIECMaterialById, checkServerHealth } from '../services/iec_materials_api';

export const useIECMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [source, setSource] = useState(null);
    const [serverAvailable, setServerAvailable] = useState(null);

    const checkServer = useCallback(async () => {
        try {
            const available = await checkServerHealth();
            setServerAvailable(available);
            return available;
        } catch (err) {
            console.error('Server check error:', err);
            setServerAvailable(false);
            return false;
        }
    }, []);

    const loadMaterials = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Check server availability
            await checkServer();
            
            const result = await fetchIECMaterials();
            
            if (result.success) {
                setMaterials(result.data || []);
                setSource(result.source);
                // Only set error if it's a real error and we couldn't get data
                if (result.source === 'api') {
                    console.log(`Loaded ${result.data?.length || 0} materials from server`);
                    setError(null);
                } else if (result.source === 'mock') {
                    // Don't set error for demo data, it's working as expected
                    console.log(`Using demo data (${result.data?.length || 0} materials)`);
                    setError(null);
                } else if (result.data?.length === 0) {
                    setError('No materials found');
                }
            } else {
                setError('Failed to load IEC materials');
                setMaterials([]);
            }
        } catch (err) {
            console.error('Error loading materials:', err);
            setError(err.message || 'Failed to load IEC materials');
            setMaterials([]);
        } finally {
            setLoading(false);
        }
    }, [checkServer]);

    const getMaterialById = useCallback(async (id) => {
        try {
            const result = await fetchIECMaterialById(id);
            return result;
        } catch (err) {
            console.error('Error fetching material by ID:', err);
            return { success: false, data: null, error: err.message };
        }
    }, []);

    const retryLoad = useCallback(() => {
        loadMaterials();
    }, [loadMaterials]);

    useEffect(() => {
        loadMaterials();
    }, [loadMaterials]);

    return {
        materials,
        loading,
        error,
        source,
        serverAvailable,
        loadMaterials,
        getMaterialById,
        retryLoad,
    };
};

export default useIECMaterials;