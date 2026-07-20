---
layout: page
permalink: /trends/
title: Trends
description: Daily AI trends and industry developments
nav: true
nav_order: 5
---

{% assign trends = site.data.trends | sort: "date" | reverse %}

<div class="trends-page">
  {% if trends and trends.size > 0 %}
    {% for day in trends %}
      <section class="mb-4">
        <h3 class="mb-3">{{ day.date | date: "%B %-d, %Y" }}</h3>

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
      </section>
    {% endfor %}
  {% else %}
    <p>No trends recorded yet.</p>
  {% endif %}
</div>
