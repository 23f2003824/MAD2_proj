export default {
    template: `
        <div id="dashboard" class="container mt-4">
            <h3>Dashboard</h3>

            <!-- Common for all roles -->
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Requests</h5>
                            <p class="card-text">{{ totalRequests }}</p>
                        </div>
                    </div>
                </div>
                <div v-if="$store.state.role === 'service_professional'" class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Average Rating</h5>
                            <p class="card-text">{{ averageRating }}</p>
                        </div>
                    </div>
                </div>  
            </div>

            <!-- Service Professional Dashboard -->
            <div v-if="$store.state.role === 'service_professional'" class="row mt-4">
                <div class="col-md-6">
                    <h5>Service Request Status</h5>
                    <canvas id="statusChart" style="max-height: 300px;"></canvas>
                </div>

                <div class="col-md-6">
                    <h5>Ratings Distribution</h5>
                    <canvas id="ratingsChart" style="max-height: 300px;"></canvas>
                </div>
            </div>

            <!-- User Dashboard -->
            <div v-if="$store.state.role === 'user'">
                <div class="row mt-4">
                    <div class="col-md-6">
                        <h5>Service Request Status</h5>
                        <canvas id="userStatusChart" style="max-height: 300px;"></canvas>
                    </div>
                </div>
            </div>

            <!-- Admin Dashboard -->
            <div v-if="$store.state.role === 'admin'">
                <div class="row mt-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Total Professionals</h5>
                                <p class="card-text">{{ totalProfessionals }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Total Users</h5>
                                <p class="card-text">{{ totalUsers }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-md-6">
                        <h5>Service Request Status</h5>
                        <canvas id="adminStatusChart" style="max-height: 300px;"></canvas>
                    </div>

                    <div class="col-md-6">
                        <h5>Average Ratings of Professionals</h5>
                        <canvas id="adminRatingsChart" style="max-height: 300px;"></canvas>
                    </div>
                </div>

                <!-- New Charts for Admin -->
                <div class="row mt-4">
                    <div class="col-md-6">
                        <h5>Professionals Per Service</h5>
                        <canvas id="professionalsChart" style="max-height: 300px;"></canvas>
                    </div>
                    <div class="col-md-6">
                        <h5>Requests Per Service</h5>
                        <canvas id="requestsChart" style="max-height: 300px;"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            totalRequests: 0,
            totalProfessionals: 0,
            totalUsers: 0,
            averageRating: 0,
            statusCounts: {},
            ratingCounts: {},
            professionalsPerService: {},
            requestsPerService: {}
        };
    },
    methods: {
        async fetchSummary() {
            let apiUrl = this.$store.state.role === 'admin' ? '/api/admin_summary' : '/api/professional_summary';

            const response = await fetch(apiUrl, {
                headers: { "Authentication-Token": this.$store.state.auth_token },
            });
            const data = await response.json();

            if (response.ok) {
                if (this.$store.state.role === 'service_professional') {
                    this.totalRequests = data.total_requests;
                    this.averageRating = data.average_rating.toFixed(2);
                    this.statusCounts = data.status_counts;
                    this.ratingCounts = data.rating_counts;
                } else if (this.$store.state.role === 'user') {
                    this.totalRequests = data.total_requests;
                    this.statusCounts = data.status_counts;
                } else if (this.$store.state.role === 'admin') {
                    this.totalRequests = data.total_requests;
                    this.totalProfessionals = data.total_professionals;
                    this.totalUsers = data.total_users;
                    this.statusCounts = data.status_counts;
                    this.ratingCounts = data.professional_avg_ratings;
                    this.professionalsPerService = data.professionals_per_service;
                    this.requestsPerService = data.requests_per_service;
                }
                this.renderCharts();
            }
        },
        renderCharts() {
            if (this.$store.state.role === 'service_professional') {
                this.renderProfessionalCharts();
            } else if (this.$store.state.role === 'user') {
                this.renderUserChart();
            } else if (this.$store.state.role === 'admin') {
                this.renderAdminCharts();
            }
        },
        renderAdminCharts() {
            this.renderBarChart('adminStatusChart', this.statusCounts, 'Service Requests');
            this.renderPieChart('adminRatingsChart', this.ratingCounts, 'Average Ratings');

            // New Admin Charts
            this.renderPieChart('professionalsChart', this.professionalsPerService, 'Professionals Per Service');
            this.renderBarChart('requestsChart', this.requestsPerService, 'Requests Per Service');
        },
        renderProfessionalCharts() {
            this.renderBarChart('statusChart', this.statusCounts, 'Service Requests');
            this.renderPieChart('ratingsChart', this.ratingCounts, 'Ratings Distribution');
        },
        renderUserChart() {
            this.renderBarChart('userStatusChart', this.statusCounts, 'User Requests');
        },
        renderBarChart(canvasId, data, label) {
            const ctx = document.getElementById(canvasId).getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(data),
                    datasets: [{
                        label: label,
                        data: Object.values(data),
                        backgroundColor: [
                            'rgba(0, 123, 255, 0.7)',  // Light Blue
                            'rgba(40, 167, 69, 0.7)',  // Light Green
                            'rgba(220, 53, 69, 0.7)'   // Light Red
                        ],
                        borderColor: [
                            'rgba(0, 123, 255, 1)',
                            'rgba(40, 167, 69, 1)',
                            'rgba(220, 53, 69, 1)'
                        ],
                        borderWidth: 2,
                        barThickness: 40
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        },
        renderPieChart(canvasId, data, label) {
            const ctx = document.getElementById(canvasId).getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(data),
                    datasets: [{
                        label: label,
                        data: Object.values(data),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',  // Light Red
                            'rgba(255, 159, 64, 0.7)',  // Light Orange
                            'rgba(255, 205, 86, 0.7)',  // Light Yellow
                            'rgba(75, 192, 192, 0.7)',  // Light Teal
                            'rgba(54, 162, 235, 0.7)'   // Light Blue
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 205, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 2,
                        hoverOffset: 8,
                    }]
                }
            });
        }
    },
    mounted() {
        this.fetchSummary();
    }
};
