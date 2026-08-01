---
layout: page
title: projects
permalink: /projects/
description: A growing collection of your cool projects.
nav: true
nav_order: 3
display_categories: [work, fun]
horizontal: false
---

<!-- pages/projects.md -->
<script defer src="/assets/js/sort-paginate.js"></script>

<div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
  <h3 class="mb-0">Projects</h3>
  <div class="d-flex align-items-center gap-2">
    <label for="projects-sort" class="form-label mb-0 small fw-medium">Sort:</label>
    <select id="projects-sort" class="form-select form-select-sm" style="width:auto;">
      <option value="importance">Importance</option>
      <option value="alpha-asc">A-Z</option>
      <option value="alpha-desc">Z-A</option>
    </select>
  </div>
</div>

<div class="projects" id="projects-container">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>

{% assign sorted_projects_all = site.projects | sort: "importance" %}
<script>
(function() {
  // Inject data attributes into the rendered project cards for JS sorting
  var cards = document.querySelectorAll('.projects .col');
  {% for proj in sorted_projects_all %}
    if (cards[{{ forloop.index0 }}]) {
      cards[{{ forloop.index0 }}].setAttribute('data-importance', '{{ proj.importance }}');
      cards[{{ forloop.index0 }}].setAttribute('data-title', '{{ proj.title | escape }}');
    }
  {% endfor %}
})();
</script>