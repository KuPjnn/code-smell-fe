export default {
    mounted(el, binding) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.src = binding.value;
                    el.classList.add("fade-in");
                    observer.unobserve(el);
                }
            });
        }, {rootMargin: "0px 0px 200px 0px"});

        observer.observe(el);
    }
}