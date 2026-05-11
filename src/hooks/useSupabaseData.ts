import { useEffect, useState } from 'react';
import { supabase, type Contact } from '../lib/supabase';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setContacts(data || []);
      } catch (err: any) {
        setError(err.message);
        // Fallback mock data for demo if table doesn't exist
        setContacts([
          { id: '1', first_name: 'Alex', last_name: 'Rivera', phone: '+1 234 567 890', status: 'lead', workspace_id: '1', created_at: new Date().toISOString(), email: null },
          { id: '2', first_name: 'Mila', last_name: 'Kunis', phone: '+44 789 012 345', status: 'customer', workspace_id: '1', created_at: new Date().toISOString(), email: null },
          { id: '3', first_name: 'Jordan', last_name: 'Belfort', phone: '+1 555 123 456', status: 'contact', workspace_id: '1', created_at: new Date().toISOString(), email: null },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();

    // Real-time subscription
    const channel = supabase
      .channel('public:contacts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contacts' }, (payload) => {
        setContacts(current => [payload.new as Contact, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function addContact(contact: Partial<Contact>) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contact])
        .select()
        .single();

      if (error) throw error;
      setContacts(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err: any) {
      console.error('Error adding contact:', err);
      return { success: false, error: err.message };
    }
  }

  return { contacts, loading, error, addContact };
}

export type Deal = {
  id: string;
  title: string;
  value: number;
  stage: string;
  contact_name: string;
  score?: number;
  health?: 'Good' | 'Fair' | 'At Risk';
};

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, mock deals until the schema is fully populated in the user's Supabase
    setDeals([
      { id: '1', title: 'Enterprise CRM Sync', value: 12400, stage: 'Negotiation', contact_name: 'Alex Rivera', score: 88, health: 'Good' },
      { id: '2', title: 'Sarah - Q4 Consulting', value: 3500, stage: 'Lead', contact_name: 'Sarah Chen', score: 42, health: 'Fair' },
      { id: '3', title: 'Initial Consultation', value: 500, stage: 'Contacted', contact_name: 'John Smith', score: 15, health: 'At Risk' },
      { id: '4', title: 'SaaS Expansion', value: 8900, stage: 'Proposal Sent', contact_name: 'Emily Davis', score: 71, health: 'Good' },
    ]);
    setLoading(false);
  }, []);

  return { deals, loading };
}

export type AutomationTrigger = {
  id: string;
  keyword: string;
  contact_name: string;
  triggered_at: string;
};

export function useAutomationAnalytics() {
  const [triggers, setTriggers] = useState<AutomationTrigger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTriggers() {
      try {
        const { data, error } = await supabase
          .from('automation_logs')
          .select('*')
          .order('triggered_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setTriggers(data || []);
      } catch (err) {
        // Fallback mock data
        setTriggers([
          { id: '1', keyword: 'price', contact_name: 'Alex Rivera', triggered_at: new Date().toISOString() },
          { id: '2', keyword: 'demo', contact_name: 'Sarah Chen', triggered_at: new Date(Date.now() - 3600000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchTriggers();
    
    // Real-time subscription
    const channel = supabase
      .channel('public:automation_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'automation_logs' }, (payload) => {
        setTriggers(current => [payload.new as AutomationTrigger, ...current.slice(0, 9)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { triggers, loading };
}

export type AutomationRule = {
  id: string;
  keyword: string;
  responses: { text: string; delay: number }[];
  is_active: boolean;
};

export function useAutomationRules() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRules() {
      try {
        const { data, error } = await supabase
          .from('automation_rules')
          .select('*');

        if (error) throw error;
        setRules(data || []);
      } catch (err) {
        // Fallback mock data
        setRules([
          { id: '1', keyword: 'price', responses: [{ text: 'Our entry plan starts at $49/mo.', delay: 2 }], is_active: true },
          { id: '2', keyword: 'demo', responses: [{ text: 'Sure! When are you free?', delay: 1 }], is_active: true },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchRules();
  }, []);

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase.from('automation_rules').delete().eq('id', id);
      if (error) throw error;
      setRules(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting rule:', err);
      return false;
    }
  };

  const toggleRule = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('automation_rules').update({ is_active: !currentStatus }).eq('id', id);
      if (error) throw error;
      setRules(prev => prev.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r));
      return true;
    } catch (err) {
      console.error('Error toggling rule:', err);
      return false;
    }
  };

  return { rules, loading, deleteRule, toggleRule };
}

export type Template = {
  id: string;
  title: string;
  body: string;
  cat?: string;
};

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const { data, error } = await supabase
          .from('message_templates')
          .select('*');

        if (error) throw error;
        setTemplates(data || []);
      } catch (err) {
        // Fallback mock data matching Templates.tsx
        setTemplates([
          { id: '1', title: 'Welcome Greeting', body: 'Hi {{name}}, welcome to our platform! How can we help today?', cat: 'Onboarding' },
          { id: '2', title: 'Special Promo Q4', body: 'Hey {{name}}, don\'t miss our exclusive 20% discount!', cat: 'Promotional' },
          { id: '3', title: 'Inactive Followup', body: 'Long time no see, {{name}}! We\'ve missed you.', cat: 'Re-engagement' },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  return { templates, loading };
}
