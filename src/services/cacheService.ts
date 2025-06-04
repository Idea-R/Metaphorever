import { supabase } from '../lib/supabase';
import { Metaphor, IdiomAnalysisResult } from '../types';

export async function getMetaphorFromCache(input: string, tone: string): Promise<Metaphor | null> {
  const { data, error } = await supabase
    .from('metaphor_cache')
    .select('*')
    .eq('input_text', input.toLowerCase().trim())
    .eq('tone', tone)
    .single();

  if (error || !data) return null;

  // Update usage count and last accessed
  await supabase
    .from('metaphor_cache')
    .update({
      usage_count: data.usage_count + 1,
      last_accessed: new Date().toISOString()
    })
    .eq('id', data.id);

  return {
    id: data.id,
    text: data.metaphor_text,
    originalInput: input,
    tone: tone,
    timestamp: Date.now(),
    isFavorite: false
  };
}

export async function saveMetaphorToCache(input: string, tone: string, metaphor: Metaphor): Promise<void> {
  await supabase
    .from('metaphor_cache')
    .upsert({
      input_text: input.toLowerCase().trim(),
      tone,
      metaphor_text: metaphor.text,
      usage_count: 1,
      last_accessed: new Date().toISOString()
    });
}

export async function getIdiomFromCache(phrase: string): Promise<IdiomAnalysisResult | null> {
  const { data, error } = await supabase
    .from('idiom_cache')
    .select('*')
    .eq('phrase', phrase.toLowerCase().trim())
    .single();

  if (error || !data) return null;

  // Update usage metrics
  await supabase
    .from('idiom_cache')
    .update({
      usage_count: data.usage_count + 1,
      last_accessed: new Date().toISOString()
    })
    .eq('id', data.id);

  return data.analysis;
}

export async function saveIdiomToCache(phrase: string, analysis: IdiomAnalysisResult): Promise<void> {
  await supabase
    .from('idiom_cache')
    .upsert({
      phrase: phrase.toLowerCase().trim(),
      analysis,
      usage_count: 1,
      last_accessed: new Date().toISOString()
    });
}

export async function updateMetrics(cacheHit: boolean): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  await supabase.rpc('update_usage_metrics', {
    p_date: today,
    p_cache_hit: cacheHit
  });
}