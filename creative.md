---
layout: page
title: Creative
permalink: /creative/
---

<style>
.creative-intro {
  margin-bottom: 40px;
  color: #555;
  font-size: 0.95em;
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.project-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.project-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.project-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}
.project-thumb {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.7);
  font-size: 1.1em;
  letter-spacing: 2px;
  font-weight: 300;
}
.project-info {
  padding: 16px;
}
.project-info h3 {
  margin: 0 0 8px;
  font-size: 1.1em;
}
.project-info p {
  margin: 0;
  font-size: 0.85em;
  color: #666;
  line-height: 1.5;
}
.project-tags {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.project-tag {
  font-size: 0.75em;
  padding: 2px 8px;
  border-radius: 3px;
  background: #f0f0f0;
  color: #666;
}
</style>

<div class="creative-intro" markdown="1">
Creative projects and experiments.
</div>

<div class="project-grid">
  <div class="project-card">
    <a href="{{ site.baseurl }}/creative/what-lies-beyond/">
      <div class="project-thumb">What Lies Beyond</div>
      <div class="project-info">
        <h3>What Lies Beyond</h3>
        <p>A short narrative game about AI, truth, and what lies beyond the screen. Canvas-based, playable in the browser.</p>
        <div class="project-tags">
          <span class="project-tag">Game</span>
          <span class="project-tag">JavaScript</span>
          <span class="project-tag">Canvas</span>
          <span class="project-tag">Narrative</span>
        </div>
      </div>
    </a>
  </div>
  <div class="project-card">
    <a href="{{ site.baseurl }}/creative/what-lies-beyond-2/">
      <div class="project-thumb">What Lies Beyond 2</div>
      <div class="project-info">
        <h3>What Lies Beyond 2</h3>
        <p>A short narrative game — the sequel to What Lies Beyond. Canvas-based, playable in the browser.</p>
        <div class="project-tags">
          <span class="project-tag">Game</span>
          <span class="project-tag">JavaScript</span>
          <span class="project-tag">Canvas</span>
          <span class="project-tag">Narrative</span>
        </div>
      </div>
    </a>
  </div>
</div>
