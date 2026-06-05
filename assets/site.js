(function () {
  var topicTabs = document.getElementById('topic-tabs');
  var topicSummary = document.getElementById('topic-summary');
  var seedGrid = document.getElementById('seed-grid');
  var seedReader = document.getElementById('seed-reader');
  var readerTitle = document.getElementById('reader-title');
  var readerContent = document.getElementById('reader-content');
  var readerTabs = Array.prototype.slice.call(document.querySelectorAll('.reader-tab'));

  var topics = [];
  var seeds = [];
  var activeTopic = null;
  var activeSeed = null;
  var activeView = 'overview';
  var fallbackData = {
    topics: [
      {
        slug: 'multimodal-learning',
        label: 'Multimodal Learning',
        description: 'Ideas about multimodal representation learning, world models, and cross-modal alignment.'
      },
      {
        slug: 'hardware',
        label: 'Hardware',
        aliases: ['sensor-design'],
        description: 'Ideas about tactile sensing, embodied data, and task-driven hardware.'
      },
      {
        slug: 'model-architecture',
        label: 'Model Architecture',
        description: 'Ideas about mechanisms, efficient architectures, and hardware-aware model design.'
      }
    ],
    seeds: [
      {
        slug: 'kuramoto-multimodal-coupling',
        topic: 'multimodal-learning',
        title: 'Kuramoto-Inspired Multimodal Coupling',
        hook: 'Learn cross-modal representations through oscillatory synchronization dynamics instead of contrastive loss alignment.',
        background: 'Dynamical systems + multimodal ML',
        rampUp: '2-3 weeks',
        contributor: 'Anthea Li',
        affiliation: 'MIT CSAIL',
        tags: ['multimodal', 'dynamics', 'representation learning'],
        readme: 'ideas/kuramoto-multimodal-coupling/README.md',
        references: 'ideas/kuramoto-multimodal-coupling/references.md'
      },
      {
        slug: 'task-driven-sensor-design',
        topic: 'hardware',
        title: 'Task-Driven Sensor Design',
        hook: 'Learn where to place tactile sensors by watching which manipulation tasks humans find easy.',
        background: 'Robotics + optimization',
        rampUp: '3-4 weeks',
        contributor: 'Anthea Li',
        affiliation: 'MIT CSAIL',
        tags: ['robotics', 'tactile sensing', 'optimization'],
        readme: 'ideas/task-driven-sensor-design/README.md',
        references: 'ideas/task-driven-sensor-design/references.md'
      }
    ]
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderInline(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, text, href) {
        return '<a href="' + escapeHtml(href) + '">' + text + '</a>';
      });
  }

  function flushParagraph(parts, output) {
    if (!parts.length) return;
    output.push('<p>' + renderInline(parts.join(' ')) + '</p>');
    parts.length = 0;
  }

  function markdownToHtml(markdown) {
    var lines = markdown.replace(/\r\n/g, '\n').split('\n');
    var output = [];
    var paragraph = [];
    var listType = null;
    var inCode = false;
    var codeLines = [];

    function closeList() {
      if (!listType) return;
      output.push('</' + listType + '>');
      listType = null;
    }

    lines.forEach(function (line) {
      var trimmed = line.trim();

      if (trimmed.indexOf('```') === 0) {
        if (inCode) {
          output.push('<pre><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
          codeLines = [];
          inCode = false;
        } else {
          flushParagraph(paragraph, output);
          closeList();
          inCode = true;
        }
        return;
      }

      if (inCode) {
        codeLines.push(line);
        return;
      }

      if (!trimmed) {
        flushParagraph(paragraph, output);
        closeList();
        return;
      }

      if (trimmed === '---') {
        flushParagraph(paragraph, output);
        closeList();
        output.push('<hr>');
        return;
      }

      var heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        flushParagraph(paragraph, output);
        closeList();
        var level = heading[1].length;
        output.push('<h' + level + '>' + renderInline(heading[2]) + '</h' + level + '>');
        return;
      }

      if (trimmed.indexOf('>') === 0) {
        flushParagraph(paragraph, output);
        closeList();
        output.push('<blockquote>' + renderInline(trimmed.replace(/^>\s?/, '')) + '</blockquote>');
        return;
      }

      var unordered = trimmed.match(/^[-*]\s+(.+)$/);
      if (unordered) {
        flushParagraph(paragraph, output);
        if (listType !== 'ul') {
          closeList();
          output.push('<ul>');
          listType = 'ul';
        }
        output.push('<li>' + renderInline(unordered[1]) + '</li>');
        return;
      }

      var ordered = trimmed.match(/^\d+\.\s+(.+)$/);
      if (ordered) {
        flushParagraph(paragraph, output);
        if (listType !== 'ol') {
          closeList();
          output.push('<ol>');
          listType = 'ol';
        }
        output.push('<li>' + renderInline(ordered[1]) + '</li>');
        return;
      }

      closeList();
      paragraph.push(trimmed);
    });

    flushParagraph(paragraph, output);
    closeList();
    return output.join('\n');
  }

  function getTopic(slug) {
    return topics.filter(function (topic) {
      return topic.slug === slug || (topic.aliases || []).indexOf(slug) !== -1;
    })[0] || topics[0];
  }

  function getSeed(slug) {
    return seeds.filter(function (seed) { return seed.slug === slug; })[0];
  }

  function getSeedsForTopic(topicSlug) {
    return seeds.filter(function (seed) { return seed.topic === topicSlug; });
  }

  function renderTopicTabs() {
    topicTabs.innerHTML = topics.map(function (topic) {
      var count = getSeedsForTopic(topic.slug).length;
      var active = activeTopic && activeTopic.slug === topic.slug ? ' active' : '';
      return [
        '<button class="topic-tab' + active + '" type="button" data-topic="' + escapeHtml(topic.slug) + '">',
        '<span>' + escapeHtml(topic.label) + '</span>',
        '<small>' + count + '</small>',
        '</button>'
      ].join('');
    }).join('');

    Array.prototype.slice.call(topicTabs.querySelectorAll('.topic-tab')).forEach(function (button) {
      button.addEventListener('click', function () {
        selectTopic(button.dataset.topic, true);
      });
    });
  }

  function renderTopicSummary(topic, topicSeeds) {
    var seedWord = topicSeeds.length === 1 ? 'seed' : 'seeds';
    topicSummary.innerHTML = [
      '<p><strong>' + escapeHtml(topic.label) + '</strong> · ',
      escapeHtml(topicSeeds.length + ' ' + seedWord),
      '</p>',
      '<p>' + escapeHtml(topic.description || '') + '</p>'
    ].join('');
  }

  function renderSeedCards() {
    var topicSeeds = getSeedsForTopic(activeTopic.slug);
    renderTopicSummary(activeTopic, topicSeeds);

    if (!topicSeeds.length) {
      seedGrid.innerHTML = [
        '<div class="empty-topic">',
        '<strong>No seeds here yet.</strong>',
        '<span>This area is open for future contributions.</span>',
        '</div>'
      ].join('');
      return;
    }

    seedGrid.innerHTML = topicSeeds.map(function (seed) {
      var tags = seed.tags.map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      var active = activeSeed && activeSeed.slug === seed.slug ? ' active' : '';
      return [
        '<button class="seed-card seed-row' + active + '" type="button" data-slug="' + escapeHtml(seed.slug) + '">',
        '<span class="seed-title-line">',
        '<strong>' + escapeHtml(seed.title) + '</strong>',
        '<span class="seed-ramp">' + escapeHtml(seed.rampUp) + '</span>',
        '</span>',
        '<span class="seed-hook">' + escapeHtml(seed.hook) + '</span>',
        '<span class="seed-meta">',
        '<span>' + escapeHtml(seed.background) + '</span>',
        '<span class="seed-tags">' + tags + '</span>',
        '</span>',
        '</button>'
      ].join('');
    }).join('');

    Array.prototype.slice.call(seedGrid.querySelectorAll('.seed-card')).forEach(function (button) {
      button.addEventListener('click', function () {
        selectSeed(button.dataset.slug, 'overview');
      });
    });
  }

  function setReaderFolded() {
    activeSeed = null;
    activeView = 'overview';
    seedReader.classList.add('is-folded');
    readerTitle.textContent = 'Select a seed to open the full writeup.';
    readerContent.innerHTML = '';
    renderReaderTabs();
  }

  function setReaderLoading(seed) {
    seedReader.classList.remove('is-folded');
    readerTitle.textContent = seed.title;
    readerContent.innerHTML = '<p class="loading-note">Loading ' + escapeHtml(activeView) + '...</p>';
  }

  function renderReaderTabs() {
    readerTabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.view === activeView);
    });
  }

  function selectTopic(topicSlug, updateHash) {
    activeTopic = getTopic(topicSlug);
    setReaderFolded();
    renderTopicTabs();
    renderSeedCards();
    if (updateHash) history.replaceState(null, '', '#' + activeTopic.slug);
  }

  function selectSeed(slug, view) {
    var nextSeed = getSeed(slug);
    if (!nextSeed) return;

    activeSeed = nextSeed;
    activeTopic = getTopic(activeSeed.topic);
    activeView = view || activeView;

    renderTopicTabs();
    renderSeedCards();
    renderReaderTabs();
    setReaderLoading(activeSeed);

    var path = activeView === 'references' ? activeSeed.references : activeSeed.readme;
    fetch(path)
      .then(function (response) {
        if (!response.ok) throw new Error('Could not load ' + path);
        return response.text();
      })
      .then(function (markdown) {
        readerContent.innerHTML = markdownToHtml(markdown);
        history.replaceState(null, '', '#' + activeSeed.slug);
      })
      .catch(function () {
        readerContent.innerHTML = [
          '<p class="error-note">Could not load this markdown file.</p>',
          '<p><a href="' + escapeHtml(path) + '">Open it directly on GitHub Pages</a>.</p>'
        ].join('');
      });
  }

  readerTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      if (!activeSeed || tab.dataset.view === activeView) return;
      selectSeed(activeSeed.slug, tab.dataset.view);
    });
  });

  function initialise(data) {
    if (Array.isArray(data)) {
      seeds = data;
      topics = [{ slug: 'all', label: 'All Seeds', description: 'All research seeds.' }];
      seeds.forEach(function (seed) { seed.topic = 'all'; });
    } else {
      topics = data.topics || [];
      seeds = data.seeds || [];
    }

    var requestedSlug = window.location.hash.replace('#', '');
    var requestedSeed = getSeed(requestedSlug);
    var requestedTopic = getTopic(requestedSlug);

    if (requestedSeed) {
      selectSeed(requestedSeed.slug, 'overview');
    } else {
      activeTopic = requestedTopic || topics[0];
      renderTopicTabs();
      renderSeedCards();
      setReaderFolded();
    }
  }

  initialise(fallbackData);

  fetch('seeds.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Could not load seeds.json');
      return response.json();
    })
    .then(initialise)
    .catch(function () {});
})();
