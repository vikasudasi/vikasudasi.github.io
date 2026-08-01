---
layout: page
permalink: /trends/
title: Trends
description: Daily AI trends and industry developments
nav: true
nav_order: 5
---

{% assign trends = site.data.trends | sort: "date" | reverse %}

<script defer src="/assets/js/sort-paginate.js"></script>

<div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
  <h3 class="mb-0">Daily AI Trends</h3>
  <div class="d-flex align-items-center gap-2">
    <label for="trends-sort" class="form-label mb-0 small fw-medium">Sort:</label>
    <select id="trends-sort" class="form-select form-select-sm" style="width:auto;">
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
    </select>
  </div>
</div>

<div id="trends-container">
  {% for day in trends %}
    <div class="trend-day-section mb-4" data-date="{{ day.date }}">
      <h4 class="mb-3">{{ day.date | date: "%B %-d, %Y" }}</h4>
      {% if day.items and day.items.size > 0 %}
        <div class="row row-cols-1 g-3">
          {% for item in day.items %}
            <div class="col">
              <div class="card h-100">
                <div class="card-body">
                  <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                    <h5 class="card-title mb-0">
                      <a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
                    </h5>
                    <span class="badge rounded-pill text-bg-secondary">{{ item.source }}</span>
                  </div>
                  <p class="card-text mb-0">{{ item.summary }}</p>
                </div>
              </div>
            </div>
          {% endfor %}
        </div>
      {% endif %}
    </div>
  {% else %}
    <p>No trends recorded yet.</p>
  {% endfor %}
</div>