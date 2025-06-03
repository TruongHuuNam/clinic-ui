// components/Home/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('doctor');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${searchTerm}&type=${searchType}`);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch}>
                <div className="search-tabs">
                    <button
                        type="button"
                        className={searchType === 'doctor' ? 'active' : ''}
                        onClick={() => setSearchType('doctor')}
                    >
                        Tìm bác sĩ
                    </button>
                    <button
                        type="button"
                        className={searchType === 'specialty' ? 'active' : ''}
                        onClick={() => setSearchType('specialty')}
                    >
                        Tìm chuyên khoa
                    </button>
                    <button
                        type="button"
                        className={searchType === 'service' ? 'active' : ''}
                        onClick={() => setSearchType('service')}
                    >
                        Gói khám
                    </button>
                </div>

                <div className="search-input">
                    <input
                        type="text"
                        placeholder={searchType === 'doctor' ? 'Tìm bác sĩ theo tên, chuyên khoa...' :
                            searchType === 'specialty' ? 'Tìm chuyên khoa...' : 'Tìm gói khám...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};