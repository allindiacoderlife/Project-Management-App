import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiFetch('/projects');
      setProjects(data);

      // Select active project if none or keep current if still valid
      setActiveProject((current) => {
        if (!current && data.length > 0) return data[0];
        if (current) {
          const match = data.find((p) => p._id === current._id);
          return match || data[0] || null;
        }
        return null;
      });
    } catch (err) {
      console.error('Failed to load projects:', err);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = async ({ title, key, description }) => {
    try {
      const newProj = await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify({ title, key, description }),
      });
      setProjects((prev) => [newProj, ...prev]);
      setActiveProject(newProj);
      addToast(`Project "${newProj.title}" created`, 'success');
      return newProj;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const addMember = async (projectId, email) => {
    try {
      const updated = await apiFetch(`/projects/${projectId}/members`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      if (activeProject?._id === updated._id) {
        setActiveProject(updated);
      }
      addToast('Team member added successfully', 'success');
      return updated;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject,
        loading,
        loadProjects,
        createProject,
        addMember,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
