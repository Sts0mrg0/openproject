#-- copyright
# OpenProject is a project management system.
# Copyright (C) 2012-2017 the OpenProject Foundation (OPF)
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
# Copyright (C) 2006-2017 Jean-Philippe Lang
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# See doc/COPYRIGHT.rdoc for more details.
#++

require 'spec_helper'

describe ::API::V3::Queries::Schemas::StringObjectFilterDependencyRepresenter do
  include ::API::V3::Utilities::PathHelper

  let(:project) { FactoryGirl.build_stubbed(:project) }
  let(:custom_field) { FactoryGirl.build_stubbed(:list_wp_custom_field) }
  let(:filter) do
    filter = Queries::WorkPackages::Filter::CustomFieldFilter.new(context: project)
    filter.custom_field = custom_field
    filter
  end
  let(:form_embedded) { false }

  let(:instance) do
    described_class.new(filter,
                        operator,
                        form_embedded: form_embedded)
  end

  subject(:generated) { instance.to_json }

  context 'generation' do
    context 'properties' do
      describe 'values' do
        let(:path) { 'values' }
        let(:type) { '[]StringObject' }
        let(:hrefs) do
          filter.allowed_values.each_with_object([]) do |value, array|
            array << api_v3_paths.string_object(value)
          end
        end

        context "for operator '='" do
          let(:operator) { "=" }

          it_behaves_like 'filter dependency with allowed value link collection'
        end

        context "for operator '!'" do
          let(:operator) { "!" }

          it_behaves_like 'filter dependency with allowed value link collection'
        end

        context "for operator '*'" do
          let(:operator) { "*" }

          it_behaves_like 'filter dependency empty'
        end

        context "for operator '!*'" do
          let(:operator) { "!*" }

          it_behaves_like 'filter dependency empty'
        end
      end
    end
  end
end
