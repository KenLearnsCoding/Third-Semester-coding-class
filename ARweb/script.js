

    function switchModel(modelSrc, posterSrc) {
      const modelViewer = document.getElementById('modelViewer');
      modelViewer.src = modelSrc;
      modelViewer.poster = posterSrc;

      // Clear the 'selected' class from all slides
      document.querySelectorAll('.slide').forEach(slide => slide.classList.remove('selected'));

      // Add the 'selected' class to the clicked slide
      event.currentTarget.classList.add('selected');
      
      // Clear existing hotspots
      modelViewer.querySelectorAll('.Hotspot').forEach(hotspot => hotspot.remove());

      // Add hotspots for the new model
      if (modelSrc === 'assets/barrel_chair.glb') {
        // Add hotspots for the barrel chair
        const hotspot1 = document.createElement('button');
        hotspot1.className = 'Hotspot';
        hotspot1.setAttribute('slot', 'hotspot-1');
        hotspot1.setAttribute('data-position', '0.4238710366953735m 0.6859293034196332m 0.1721292462516119m');
        hotspot1.setAttribute('data-normal', '-0.0948694562782868m 0.955832495769737m 0.27817984523695855m');
        hotspot1.setAttribute('data-visibility-attribute', 'visible');
        hotspot1.innerHTML = '<div class="HotspotAnnotation">Barrel Chair</div>';
        modelViewer.appendChild(hotspot1);

        const hotspot2 = document.createElement('button');
        hotspot2.className = 'Hotspot';
        hotspot2.setAttribute('slot', 'hotspot-2');
        hotspot2.setAttribute('data-position', '-0.3549309468744586m 0.61291879893558m 0.3796207010691713m');
        hotspot2.setAttribute('data-normal', '0.46038126360228104m 0.6841406357582732m 0.5656860283127318m');
        hotspot2.setAttribute('data-visibility-attribute', 'visible');
        hotspot2.innerHTML = '<div class="HotspotAnnotation">Cool Texture</div>';
        modelViewer.appendChild(hotspot2);

        const hotspot3 = document.createElement('button');
        hotspot3.className = 'Hotspot';
        hotspot3.setAttribute('slot', 'hotspot-3');
        hotspot3.setAttribute('data-position', '0.10721144093747526m 0.027428990849131862m 0.3994770711231708m');
        hotspot3.setAttribute('data-normal', '-2.2735862779592368e-7m 0.9999999999999716m 7.305759690293217e-8m');
        hotspot3.setAttribute('data-visibility-attribute', 'visible');
        hotspot3.innerHTML = '<div class="HotspotAnnotation">Base</div>';
        modelViewer.appendChild(hotspot3);
      } else if (modelSrc === 'assets/chair.glb') {
        // Add hotspots for the chair
        const hotspot1 = document.createElement('button');
        hotspot1.className = 'Hotspot';
        hotspot1.setAttribute('slot', 'hotspot-2');
        hotspot1.setAttribute('data-position', '0.03227875628294502m 1.6098149314595471m 0.6559302620700731m');
        hotspot1.setAttribute('data-normal', '-0.17348879993444088m 0.08598967738786084m 0.9810746208520732m');
        hotspot1.setAttribute('data-visibility-attribute', 'visible');
        hotspot1.innerHTML = '<div class="HotspotAnnotation">Chair with a customized texture</div>';
        modelViewer2.appendChild(hotspot2);

        const hotspot2 = document.createElement('button');
        hotspot2.className = 'Hotspot';
        hotspot2.setAttribute('slot', 'hotspot-6');
        hotspot2.setAttribute('data-position', '1.7304868614327353m 0.8139733842251318m -0.13373318422144143m');
        hotspot2.setAttribute('data-normal', '0.005032420788479421m 0.1963393868999728m 0.9805230848341873m');
        hotspot2.setAttribute('data-visibility-attribute', 'visible');
        hotspot2.innerHTML = '<div class="HotspotAnnotation">Liquid background with Toronto label</div>';
        modelViewer2.appendChild(hotspot6);

        const hotspot3 = document.createElement('button');
        hotspot3.className = 'Hotspot';
        hotspot3.setAttribute('slot', 'hotspot-7');
        hotspot3.setAttribute('data-position', '-0.21274087498510158m 0.04768214938022097m 1.3987126664840268m');
        hotspot3.setAttribute('data-normal', '-0.28732429135797316m 0.6619407482193961m 0.6922999331520874m');
        hotspot3.setAttribute('data-visibility-attribute', 'visible');
        hotspot3.innerHTML = '<div class="HotspotAnnotation">Base</div>';
        modelViewer2.appendChild(hotspot7);
      }
    }