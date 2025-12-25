// My Study Friend - Science Page Interactions

document.addEventListener('DOMContentLoaded', () => {
    initElementInteractions();
});

function initElementInteractions() {
    const elements = document.querySelectorAll('.element');
    const infoPanel = document.getElementById('element-info');
    
    elements.forEach(element => {
        element.addEventListener('click', () => {
            const symbol = element.querySelector('.symbol').textContent;
            const name = element.querySelector('.name').textContent;
            const mass = element.querySelector('.mass').textContent;
            const number = element.querySelector('.atomic-number').textContent;
            
            // Get element category from class
            const categories = ['alkali', 'alkaline', 'transition', 'post-trans', 'metalloid', 'nonmetal', 'halogen', 'noble', 'lanthanide', 'actinide'];
            let category = 'Unknown';
            categories.forEach(cat => {
                if (element.classList.contains(cat)) {
                    category = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
                }
            });
            
            // Update info panel
            infoPanel.innerHTML = `
                <div class="element-detail">
                    <div class="element-symbol-large">${symbol}</div>
                    <div class="element-info-grid">
                        <div class="info-item">
                            <span class="info-label">Name</span>
                            <span class="info-value">${name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Atomic Number</span>
                            <span class="info-value">${number}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Atomic Mass</span>
                            <span class="info-value">${mass}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Category</span>
                            <span class="info-value">${category}</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Add styles for the detail view
            const style = document.createElement('style');
            style.textContent = `
                .element-detail {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    justify-content: center;
                }
                .element-symbol-large {
                    font-size: 4rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .element-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }
                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .info-label {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }
                .info-value {
                    font-size: 1rem;
                    font-weight: 600;
                }
            `;
            if (!document.querySelector('#element-detail-styles')) {
                style.id = 'element-detail-styles';
                document.head.appendChild(style);
            }
            
            // Highlight selected element
            elements.forEach(el => el.classList.remove('selected'));
            element.classList.add('selected');
        });
    });
}